import db from '../config/db.js';
import express from 'express';
import bcrypt, { truncates } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transporter from '../middleWares/email.js';
import upload from '../middleWares/multer.js';

const router = express.Router();


//Email Verification
router.post('/check', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required!' });

  const checkUserQuery = 'SELECT * FROM users WHERE email = ?';

  db.query(checkUserQuery, [email], async (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    if (data.length > 0) return res.status(400).json({ message: 'Email already exists!' });

    const token = jwt.sign({ name, email, password }, '1234', { expiresIn: '1h' });
    const verificationLink = `http://localhost:3000/auth2/${token}`;

    try {
      await transporter.sendMail({
        from: 'aymenrch37@gmail.com',
        to: email,
        subject: 'Email Verification - Action Required',
        html: `
          <p>Dear user,</p>
          <p>Thank you for registering with us. To complete the verification process and activate your account, please click the link below:</p>
          <p><a href="${verificationLink}">Verify My Email</a></p>
          <p>If you did not request this, please ignore this message.</p>
          <p>Best regards,<br>Your Company Team</p>
        `,
      });
      
      res.json({ message: 'Email verification sent!' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ error: error.message });
    }
  });
});
//decode token
router.get('/decode-token/:token', (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, '1234');
    res.json({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});


//User Registration
router.post('/register/:token', upload.single('ProfilePicture'), async (req, res) => {
  const { token } = req.params;
  const { bio, phone, address, faceDescriptor } = req.body;
  const ProfilePicture = req.file ? 'uploads/' + req.file.filename : null;

  try {
    const decoded = jwt.verify(token, '1234');
    const { name, email, password } = decoded;

    const hashedPassword = await bcrypt.hash(password, 10);
    const registerDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertUserQuery = `
      INSERT INTO users (name, email, password, phone, bio, ProfilePicture, registerDate, adress, faceDescriptor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertUserQuery,
      [name, email, hashedPassword, phone, bio, ProfilePicture, registerDate, address, faceDescriptor],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }

        const userId = result.insertId; // Get the inserted user's ID

        // Execute the statsQuery
        const statsQuery = `
          INSERT INTO stats (userId, totalInvestmentAmount, totalReturns, activeInvestments, completedInvestements, totalFundingRaised, activeProjects, completedprojects, pendingInvestorRequestes)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          statsQuery,
          [userId, 0, 0, 0, 0, 0, 0, 0, 0], // Initialize stats with default values
          (statsErr) => {
            if (statsErr) {
              console.error('Stats insertion error:', statsErr);
              return res.status(500).json({ error: 'Stats insertion failed: ' + statsErr.message });
            }

            res.status(201).json({ message: 'User registered successfully with stats!' });

            transporter.sendMail({
              from: 'aymenrch37@gmail.com',
              to: email,
              subject: 'Welcome to Shark Tank - Account Successfully Created!',
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 20px auto;">
                  <h2 style="color: #007bff;">Hello ${name},</h2>
                  <p>We're excited to inform you that your Shark Tank account has been successfully created!</p>
                  <p>You can now explore and engage with projects, connect with entrepreneurs, and take your first step toward investing or showcasing your ideas.</p>
                  <p>If you have any questions or need support, feel free to reach out to us.</p>
                  <p>Welcome aboard!</p>
                  <p style="margin-top: 20px; color: #555;">Best regards,<br>Shark Tank Team</p>
                </div>
              `,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});




//User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const loginQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(loginQuery, [email], async (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    if (data.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = data[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, '1766736', { expiresIn: '1h' });
    res.json({ token, message: 'Login successful!' });
  });
});

//user data after login
router.get('/get/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify the token
    const decoded = jwt.verify(token, '1766736'); // Ensure the secret matches the one used during login
    const userId = decoded.id; // Extract the user ID

    // Fetch user data
    const userQuery = "SELECT name , ProfilePicture FROM users WHERE id = ?";
    const statsQuery = "SELECT * FROM stats WHERE userId = ?";

    db.query(userQuery, [userId], (err, userResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch user stats after getting user data
      db.query(statsQuery, [userId], (err, statsResult) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Send a single response with both user and stats data
        res.json({
          user: userResult[0],
          stats: statsResult.length > 0 ? statsResult[0] : null, // Return null if no stats found
        });
      });
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

//user profile
router.get('/profile/:token', (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, '1766736');
    const userId = decoded.id;

    // Fetch user
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [userId], (err, userResult) => {
      if (err) {
        console.error('Database error (user):', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (userResult.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch stats
      const query2 = "SELECT * FROM stats WHERE userId = ?";
      db.query(query2, [userId], (err, statsResult) => {
        if (err) {
          console.error('Database error (stats):', err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Even if stats not found, return user with null stats
        res.json({
          user: userResult[0],
          stats: statsResult[0] || null
        });
      });
    });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});


// Get user profile by ID
router.get('/owner/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM users WHERE id = ?";

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const query2 = "SELECT * FROM stats WHERE userId = ?"
        db.query(query2,[id],(err2,data)=>{
          if (err2) {
            console.error('Database error:', err2);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json({
          user: result,
          stats: data
        })
        })
    });
});




// Delete Account 
router.delete('/delete/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify the token
    const decoded = jwt.verify(token, '1766736'); // Ensure the secret key matches
    const userId = decoded.id; // Extract the user ID

    // Start by deleting user stats (if applicable)
    const deleteStatsQuery = "DELETE FROM stats WHERE userId = ?";
    db.query(deleteStatsQuery, [userId], (statsErr, statsResult) => {
      if (statsErr) {
        console.error('Stats deletion error:', statsErr);
        return res.status(500).json({ error: 'Failed to delete user stats' });
      }

      // Once stats are deleted, proceed with user deletion
      const deleteUserQuery = "DELETE FROM users WHERE id = ?";
      db.query(deleteUserQuery, [userId], (userErr, userResult) => {
        if (userErr) {
          console.error('User deletion error:', userErr);
          return res.status(500).json({ error: 'Failed to delete user account' });
        }

        if (userResult.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found or already deleted' });
        }

        res.json({ message: 'Account deleted successfully!' });
      });
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

router.post('/card/:token',async(req,res)=>{

  try {
  

  const token = req.params.token
  const decoded = await jwt.verify(token, '1766736'); 
  const userId = decoded.id;
  const {number, expirationDate, type} = req.body

  const query = "INSERT INTO card (userId, number, expirationDate, type) Values (?,?,?,?)"

  db.query(query,[userId,number,expirationDate,type],(err,data)=>{
    if(err){
      console.error('User deletion error:', err);
      return res.status(500).json({message: err})
    }
    return res.status(201).json({message: 'Payment Card Added Successfully!'})
  })
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }

});

router.delete('/deletePay/:id',(req,res)=>{

  try {
    const id = req.params.id
  query = "DELETE FROM paymentcard WHERE id = ?"

  db.query(query,[id],(err,data)=>{

    if(err){
      console.error({message:err});
      return res.status(500).json(err)
    }
    return res.status(201).json({message:'Payment Card deleted successfully!'})
  })
  } catch (error) {
    console.error(error);
    return res.status(201).json({message: error})
  }

});

router.get('/checkCard/:token',async(req,res)=>{

  const token = req.params.token
  try {
    const decoded = await jwt.verify(token, '1766736'); 
    const userId = decoded.id;
    const query = "SELECT * FROM card WHERE userId = ?"

    db.query(query,[userId],(err,data)=>{
      if(err){
        console.error({message:err});
        return res.status(500).json(err)
      }
      if(data.length === 0){
        return res.status(404).json({message:'No payment card found!'})
      }
      return res.status(200).json(data)
    })
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

});

router.get('/notifications/:token', (req, res) => {
  try {
    const token = req.params.token; // <-- FIXED
    const decoded = jwt.verify(token, '1766736');
    const userId = decoded.id;
    
    const query = "SELECT * FROM notification WHERE userId = ?";
    db.query(query, [userId], (err, data) => {
      if (err) {
        console.error({ message: err });
        return res.status(500).json(err);
      }
      return res.status(200).json(data); // use 200, not 201
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired token' }); // use 401 for auth errors
  }
});


router.put('/notifications/:id',(req,res)=>{
  try {
    const id = req.params.id
    const query = "UPDATE notification SET state = 'read' WHERE id = ?"

    db.query(query,[id],(err,data)=>{
      if(err){
        console.error({message:err});
        return res.status(500).json(err)
      }
      return res.status(200).json({message:'Notification updated successfully!'})
    })
  } catch (error) {
    console.error(error);
    return res.status(201).json({message: error})
  }
}

);

router.get('/identity/:token',(req,res)=>{
  const token = req.params.token;
  const decoded = jwt.verify(token, '1766736');
  const id = decoded.id
  const query = "SELECT faceDescriptor FROM users WHERE id = ?"

  db.query(query,[id],(err,data)=>{
    if(err) return res.status(404).json({message: err})
      return res.status(200).json(data)
  })
})


export default router;
