import express from 'express'
import db from '../config/db.js'
import jwt from 'jsonwebtoken'
import transporter from '../middleWares/email.js'
import upload from '../middleWares/multer.js'

const router = express.Router()

// Get all projects
router.get('/all', (req, res) => {
    const query = "SELECT * FROM projects"
    db.query(query, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.json(data);
    });
});

// Get a single project by ID
router.get('/one/:id', (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM projects WHERE id = ?";
    db.query(query, [id], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.json(data[0]);
    });
});

// Get user's projects
router.get('/mine', (req, res) => {
    const authHead = req.headers.authorization;
    if (!authHead) return res.status(401).json({ error: "Token is required" });

    const token = authHead.split(" ")[1];
    let decoded;
    try {
        decoded = jwt.verify(token, '1766736');
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }

    const userId = decoded.id;
    const query = "SELECT * FROM projects WHERE userId = ?";

    db.query(query, [userId], (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        return res.json(data);
    });
});

// project owner
router.get('/owner/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT userId FROM projects WHERE id = ?";

    db.query(query, [id], (err, data) => {
        if (err) return res.status(501).json({ error: err.message });

        if (data.length === 0) {
            return res.status(404).json({ message: "Project not found" });
        }

        const userId = data[0].userId;
        const query2 = "SELECT * FROM users WHERE id = ?";

        db.query(query2, [userId], (err, result) => {
            if (err) return res.status(501).json({ error: err.message });

            return res.status(200).json(result[0]);
        });
    });
});

//another user's projects
router.get('/him/:id',(req,res)=>{

    const {id} = req.params
    const query = "SELECT * FROM projects WHERE userId = ?"
    
    db.query(query,[id],(err,data)=>{
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        return res.status(200).json(data)
    })

})


// Create a new project
router.post('/create/:token', upload.single('picture'), async (req, res) => {
    try {
        const { token } = req.params;
        const {
            title,
            description,
            budget,
            model,
            projectStatus,
            equetyPercentage,
            revenueSharePercentage,
            deadline,
            location,
            category,
        } = req.body;

        const picture = req.file ? `/uploads/${req.file.filename}` : null;

        // Verify the token
        const decoded = jwt.verify(token, '1766736');
        const userId = decoded.id;

        const insertQuery = `
            INSERT INTO projects 
            (userId, title, description, fundingGoal, projectStatus, equetyPercentage, revenueSharePercentage, duration, location, picture, type, model) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
        `;

        db.query(insertQuery, [
            userId,
            title,
            description,
            budget,
            projectStatus,
            equetyPercentage,
            revenueSharePercentage,
            deadline,
            location,
            picture,
            category,
            model
        ], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }

            // Get user's name and email
            const emailQuery = "SELECT name, email FROM users WHERE id = ?";
            db.query(emailQuery, [userId], (emailErr, emailData) => {
                if (emailErr || emailData.length === 0) {
                    console.error('Email query error:', emailErr);
                    return res.status(201).json({ message: 'Project created but email notification failed' });
                }

                const { name: userName, email: userEmail } = emailData[0];

                // Send email notification
                if (userEmail) {
                    transporter.sendMail({
                        from: 'aymenrch37@gmail.com',
                        to: userEmail,
                        subject: 'Shark Tank - Project Successfully Created!',
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 20px auto;">
                                <h2 style="color: #007bff;">Hello ${userName},</h2>
                                <p>We're excited to inform you that your Shark Tank Project has been successfully created!</p>
                                <p>Entrepreneurs can now explore the details of your project, connect with you, and take the first step toward investing with you.</p>
                                <p>If you have any questions or need support, feel free to reach out to us.</p>
                                <p style="margin-top: 20px; color: #555;">Best regards,<br>Shark Tank Team</p>
                            </div>
                        `,
                    }, (mailErr) => {
                        if (mailErr) console.error('Email send error:', mailErr);
                    });

                    // Update project stats
                    const updateStatsQuery = "UPDATE stats SET activeProjects = activeProjects + 1 WHERE userId = ?";
                    db.query(updateStatsQuery, [userId], (statsErr) => {
                        if (statsErr) {
                            console.error('Stats update error:', statsErr);
                            return res.status(500).json({ error: 'Stats update failed: ' + statsErr.message });
                        }

                        return res.status(201).json({ message: 'Project created successfully!' });
                    });
                } else {
                    return res.status(201).json({ message: 'Project created successfully, but no email found' });
                }
            });
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});


// Delete a project
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM projects WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.json({ message: 'Project deleted successfully' });
    });
});

// Update a project
router.put('/update/:id', upload.single('ProfilePicture'), (req, res) => {
    const id = req.params.id;
    const {
        title,
        description,
        fundingGoal,
        projectStatus,
        equetyPercentage,
        revenueSharePercentage,
        duration,
        location
    } = req.body;
    const picture = req.file ? req.file.path : null;

    const query = "UPDATE projects SET title = ?, description = ?, fundingGoal = ?, projectStatus = ?, equetyPercentage = ?, revenueSharePercentage = ?, duration = ?, location = ?, picture = ? WHERE id = ?";

    db.query(query, [
        title,
        description,
        fundingGoal,
        projectStatus,
        equetyPercentage,
        revenueSharePercentage,
        duration,
        location,
        picture,
        id
    ], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        return res.json({ message: 'Project updated successfully' });
    });
});

export default router;
