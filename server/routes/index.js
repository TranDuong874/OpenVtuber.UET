const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const router = express.Router();
const jobsFilePath = path.resolve(__dirname, '../jobs.json');
let jobs = {}; // In-memory jobs storage

// Load existing jobs from the JSON file when server starts
function loadJobs() {
    if (fs.existsSync(jobsFilePath)) {
        const data = fs.readFileSync(jobsFilePath, 'utf8');
        jobs = JSON.parse(data);
    }
}

// Save jobs to the JSON file
function saveJobs() {
    fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2), 'utf8');
}

// Configuration for storing uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const fileName = file.fieldname + '-' + Date.now() + ext;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Load jobs when server starts
loadJobs();

// Handle video processing
router.post('/upload-video', upload.single('uploaded-file'), (req, res) => {
    const fileNameWithoutExt    = path.basename(req.file.filename, path.extname(req.file.filename));
    const uploadedFilePath      = path.resolve(req.file.path);
    const outputVideoPath       = path.resolve(__dirname, '../output/', fileNameWithoutExt, req.file.filename);
    const outputJsonPath        = path.resolve(__dirname, '../output/', fileNameWithoutExt, 'facial_data.json');
    const pythonScriptPath      = path.resolve(__dirname, '../videoProcessing.py');

    const jobId = uuidv4();
    jobs[jobId] = { status: 'processing', progress: '', outputVideo: outputVideoPath };
    saveJobs(); // Save the new job to JSON

    res.status(202).json({ message: 'Video processing started', jobId: jobId });

    const pythonProcess = spawn('python', [pythonScriptPath, uploadedFilePath, req.file.filename]);

    pythonProcess.stdout.on('data', (data) => {
        jobs[jobId].progress = data.toString();
        saveJobs(); // Update the jobs file with progress
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        jobs[jobId].status = code === 0 ? 'completed' : 'failed';
        if (code === 0) {
            jobs[jobId].outputJson = outputJsonPath;
        }
        saveJobs(); // Save the updated job status
    });
});

// Send Server-Sent Events with job status
router.get('/events/:jobId', (req, res) => {
    const { jobId } = req.params;
    if (!jobs[jobId]) {
        return res.status(404).json({ error: 'Job not found' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const interval = setInterval(() => {
        const job = jobs[jobId];
        res.write(`data: ${JSON.stringify({ status: job.status, progress: job.progress })}\n\n`);

        // Close SSE if the job is complete or failed
        if (job.status === 'completed' || job.status === 'failed') {
            clearInterval(interval);
            res.write(`data: ${JSON.stringify({ status: job.status })}\n\n`);
            res.end();
        }
    }, 1000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});

// Endpoint to download JSON
router.get('/download/:jobId/json', (req, res) => {
    const jobId = req.params.jobId;

    if (!jobs[jobId]) {
        return res.status(404).json({ error: 'Job not found' });
    }

    if (jobs[jobId].status === 'completed' && jobs[jobId].outputJson) {
        const outputJsonPath = jobs[jobId].outputJson;

        if (fs.existsSync(outputJsonPath)) {
            res.download(outputJsonPath); // Sends the JSON file
        } else {
            res.status(404).json({ error: 'JSON file not found' });
        }
    } else {
        res.status(500).json({ error: 'Processing failed or still in progress' });
    }
});

// Endpoint to download processed video
router.get('/download/:jobId/video', (req, res) => {
    const jobId = req.params.jobId;

    if (!jobs[jobId]) {
        return res.status(404).json({ error: 'Job not found' });
    }

    if (jobs[jobId].status === 'completed' && jobs[jobId].outputVideo) {
        const processedVideoPath = jobs[jobId].outputVideo;

        if (fs.existsSync(processedVideoPath)) {
            console.log(processedVideoPath);
            res.download(processedVideoPath); // Sends the video file
        } else {
            res.status(404).json({ error: 'Processed video not found' });
        }
    } else {
        res.status(500).json({ error: 'Processing failed or still in progress' });
    }
});


module.exports = router;
