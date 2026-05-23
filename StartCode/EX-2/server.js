// server.js
import express from 'express';
import courses from "./course.js";
const app = express();
const PORT = 3000;

// logger Middleware
function logger(req, res, next){
    const timeStamp = new Date().toISOString();

    console.log({
        timeStamp,
        method: req.method,
        path:req.path,
        query: req.query
    });

    next();
}

// Validate Query Middleware
function isPositiveIntegerString(value){
    return typeof value === 'string' && /^[1-9]d*$/.test(value);
};

function validateQuery(req, res, next){
    const { minCredits, maxCredits } = req.query;

    if (minCredits !== undefined && !isPositiveIntegerString(minCredits)){
        return res.status(400).json({
            error: 'minCredits must be an integer'
        });
    }

    if (maxCredits !== undefined && !isPositiveIntegerString(maxCredits)){
        return res.status(400).json({
            error: 'maxCredits must be an integer'
        });
    }

    if (minCredits !== undefined && maxCredits !== undefined){
        const min = Number(minCredits);
        const max = Number(maxCredits);

        if (min > max){
            res.status(400).json({
                error: 'Invalid credits range: minCredits cannot be > maxCredits!'
            });
        }
    }

    next();
}

// Authorization Middleware
const VALID_TOKEN = 'abc6767';

function auth(req, res, next) {
    const { token } = req.query;

    if ( token !== VALID_TOKEN ){
        return res.status(401).json({
            error: 'Unauthorized: invalid token!'
        });
    }
}


app.use(logger);

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', auth, validateQuery, (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;
    // Implementing the filter logic
    // Hint: Use the filter method to filter the courses array based on the provided criteria
    
    const deptValue = String(dept).toUpperCase();
    const levelValue = typeof level === 'string' ? level.toLowerCase() : null;
    const semesterValue = typeof semester === 'string' ? semester.toLowerCase() : null;
    const instructorValue = typeof instructor === 'string' ? instructor.toLowerCase() : null;

    const parsedMin = Number(minCredits);
    const parsedMax = Number(maxCredits);

    const hasMin = minCredits !== undefined && !Number.isNaN(parsedMin);
    const hasMax = maxCredits !== undefined && !Number.isNaN(parsedMax);

    if (hasMin && hasMax && parsedMin > parsedMax) {
        return res.status(400).json({
            error: "Invalid credit range: minCredits cannot be > maxCredits!"
        });
    }

    const results = courses.filter((course) => {
        if (course.department.toUpperCase() !== deptValue) return false;
        if (levelValue && course.level.toLowerCase() !== levelValue) return false;
        if (hasMin && course.credits < parsedMin) return false;
        if (hasMax && course.credits > parsedMax) return false;
        if (semesterValue && course.semester.toLowerCase() !== semesterValue) return false;
        if (instructorValue && !course.instructor.toLowerCase().includes(instructorValue)) return false;
        return true;
    });

    return res.json({
        results
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
