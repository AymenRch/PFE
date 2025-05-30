import express from 'express'
import db from '../config/db.js'
import transporter from '../middleWares/email.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const router = express.Router()


router.get('/mine/:token',(req,res)=>{
    const {token} = req.params
    const decoded =  jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const query = `
        SELECT investmentdeal.*, projects.title AS projectTitle
        FROM investmentdeal
        JOIN projects ON investmentdeal.projectId = projects.id
        WHERE investmentdeal.entrepreneurId = ?
      `

    db.query(query,[id],(err,data)=>{
        if(err) return res.status(500).json(err)
            return res.status(200).json(data)
    })
});
router.get('/who/:id',(req,res)=>{
   const id = req.params
    const query = "SELECT * FROM investmentdeal WHERE entrepreneurId = ?"

    db.query(query,[id],(err,data)=>{
        if(err) return res.status(500).json(err)
            return res.status(200).json(data)
    })
});

// Make an investment request

router.post('/make/:id', async (req, res) => {
  try {
    const authHead = req.headers.authorization;
    if (!authHead) return res.status(401).json({ error: "Token is required" });

    const token = authHead.split(" ")[1];
    const decoded = jwt.verify(token, '1766736');
    const investorId = decoded.id;
    const projectId = req.params.id;

   

      const projectQuery = "SELECT * FROM projects WHERE id = ?";
      db.query(projectQuery, [projectId], (err, projectData) => {
        if (err) return res.status(500).json({ error: err.message });
        if (projectData.length === 0) return res.status(404).json({ error: 'Project not found' });

        const project = projectData[0];
        const entrepreneurId = project.userId;

        if(entrepreneurId === investorId) return res.status(201).json({message:'You Can Not Invest In Your Own Project '})

        const insertDealQuery = `
          INSERT INTO investmentDeal 
          (entrepreneurId, investorId, projectId, investmentModel, investmentAmount, equityPercentage, revenueSharePercentage, duration, dealStatus)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          entrepreneurId,
          investorId,
          projectId,
          "equity",
          project.fundingGoal,
          project.equetyPercentage,
          project.revenueSharePercentage,
          project.duration,
          "pending"
        ];

        db.query(insertDealQuery, values, async (err) => {
          if (err) return res.status(500).json({ error: err.message });

          const getEmailQuery = "SELECT name, email FROM users WHERE id = ?";
          db.query(getEmailQuery, [entrepreneurId], async (err, userData) => {
            if (err) return res.status(500).json({ error: err.message });
            if (userData.length === 0) return res.status(404).json({ error: 'Entrepreneur not found' });

            const { email, name } = userData[0];
            const title = project.title;

            try {
              await transporter.sendMail({
                from: 'aymenrch37@gmail.com',
                to: email,
                subject: 'Email Verification - Action Required',
                html: `
                  <p>Hi ${name},</p>
                  <p>I hope you're doing well.</p>
                  <p>You have a new offer for the <strong>${title}</strong> project.</p>
                  <p>Feel free to review the details at your earliest convenience.</p>
                  <p>Best regards,<br>[Your Name]</p>
                `,
              });
            } catch (mailErr) {
              console.warn('Email failed to send:', mailErr.message);
              // Optionally continue without throwing
            }

            const notificationQuery = `
              INSERT INTO notification (userId, message, timeStamp, state, userType, title) 
              VALUES (?, ?, ?, ?, ?, ?)`;

            const message = 'You have a new investment request for your project: ' + title;
            const timeStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

            db.query(notificationQuery, [entrepreneurId, message, timeStamp, 'unread', 'entreproneur', 'NEW REQUEST'], (err) => {
              if (err) return res.status(500).json({ error: err.message });

              return res.status(201).json({ message: 'Investment request sent successfully' });
            });
          });
        });
      });
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});



// Accept a request
router.put('/accept/:id', async (req, res) => {
    try {
        const dealId = req.params.id;
        const authHead = req.headers.authorization;
        if (!authHead) return res.status(401).json({ error: "Token is required" });

        const token = authHead.split(" ")[1];
        const decoded = jwt.verify(token, '1766736');
        const entrepreneurId = decoded.id;

        // Update deal status
        const acceptQuery = "UPDATE investmentDeal SET dealStatus = ? WHERE id = ? AND entrepreneurId = ?";
        db.query(acceptQuery, ["accepted", dealId, entrepreneurId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Deal not found or unauthorized' });
            }

            // Get deal details
            const dealQuery = "SELECT * FROM investmentDeal WHERE id = ?";
            db.query(dealQuery, [dealId], (err, dealData) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error: ' + err.message });
                }

                const deal = dealData[0];

                // Create contract
                const contractQuery = `
                    INSERT INTO contract 
                    (entrepreneurId, investorId, dealId, investmentModel, equityPercentage, revenueSharePercentage, duration, signed,projectId)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(contractQuery, [
                    deal.entrepreneurId,
                    deal.investorId,
                    dealId,
                    deal.investmentModel,
                    deal.equityPercentage,
                    deal.revenueSharePercentage,
                    deal.duration,
                    "unsigned",
                    deal.projectId
                ], (err) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Database error: ' + err.message });
                    }

                    // Create notification for investor
                    const notificationQuery = `
                        INSERT INTO notification 
                        (userId, message, timeStamp, state, userType)
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    const message = "Congratulations! One of your offers has been accepted. Please check your contracts.";
                    const timeStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

                    db.query(notificationQuery, [
                        deal.investorId,
                        message,
                        timeStamp,
                        "unread",
                        "investor"
                    ], (err) => {
                        if (err) {
                            console.error('Notification error:', err);
                            return res.status(201).json({ message: 'Offer accepted but notification failed' });
                        }
                        return res.status(201).json({ message: 'Offer accepted successfully' });
                    });
                });
            });
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});

// Reject an offer
router.put('/reject/:id', async (req, res) => {
    try {
        const dealId = req.params.id;
        const authHead = req.headers.authorization;
        if (!authHead) return res.status(401).json({ error: "Token is required" });

        const token = authHead.split(" ")[1];
        const decoded = jwt.verify(token, '1766736');
        const entrepreneurId = decoded.id;

        // Update deal status
        const rejectQuery = "UPDATE investmentDeal SET dealStatus = ? WHERE id = ? AND entrepreneurId = ?";
        db.query(rejectQuery, ["rejected", dealId, entrepreneurId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error: ' + err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Deal not found or unauthorized' });
            }

            // Get investor ID for notification
            const getQuery = "SELECT investorId FROM investmentDeal WHERE id = ?";
            db.query(getQuery, [dealId], (err, data) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error: ' + err.message });
                }

                const investorId = data[0].investorId;

                // Create notification
                const notificationQuery = `
                    INSERT INTO notification 
                    (userId, message, timeStamp, state, userType)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const message = "We are sorry to inform you that one of your investment deal requests has been rejected by the entrepreneur. Please check your investment requests list for more details.";
                const timeStamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

                db.query(notificationQuery, [
                    investorId,
                    message,
                    timeStamp,
                    "unread",
                    "investor"
                ], (err) => {
                    if (err) {
                        console.error('Notification error:', err);
                        return res.status(201).json({ message: 'Offer rejected but notification failed' });
                    }
                    return res.status(201).json({ message: 'Offer rejected successfully' });
                });
            });
        });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
});

router.get('/contracts/:token', (req, res) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, '1766736');
    const id = decoded.id;
    if (!id) return res.status(401).json({ error: "Invalid token" });

    // Join contract with projects to get the project title for entrepreneur contracts
    const query = `
      SELECT contract.*, projects.title AS projectTitle
      FROM contract
      JOIN projects ON contract.projectId = projects.id
      WHERE contract.entrepreneurId = ?
    `;
    db.query(query, [id], (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      // Join contract with projects to get the project title for investor contracts
      const query2 = `
        SELECT contract.*, projects.title AS projectTitle
        FROM contract
        JOIN projects ON contract.projectId = projects.id
        WHERE contract.investorId = ?
      `;
      db.query(query2, [id], (err, data2) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error: ' + err.message });
        }
        return res.status(200).json({
          entrepreneurContracts: data,
          investorContracts: data2
        });
      });
    });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

router.get('/contract/:id', (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT contract.*, projects.title AS projectTitle 
    FROM contract
    JOIN projects ON contract.projectId = projects.id
    WHERE contract.id = ?
  `;

  db.query(query, [id], (err, contractData) => {
    if (err) return res.status(500).json({ error: err.message });
    if (contractData.length === 0) return res.status(404).json({ error: 'Contract not found' });

    const contract = contractData[0];
    const investorId = contract.investorId;
    const entrepreneurId = contract.entrepreneurId;

    const query2 = `
      SELECT * FROM users 
      WHERE id IN (?, ?)
    `;

    db.query(query2, [investorId, entrepreneurId], (err2, userData) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (userData.length < 2) return res.status(404).json({ error: 'One or both users not found' });

      // Trouver les bons utilisateurs par ID
      const investorData = userData.find(user => user.id === investorId);
      const entrepreneurData = userData.find(user => user.id === entrepreneurId);

      return res.status(200).json({
        contract,
        investorData,
        entrepreneurData
      });
    });
  });
});


router.post('/counter/:id',(req,res)=>{
  const authHead = req.headers.authorization;
  if (!authHead) return res.status(401).json({ error: "Token is required" });
  const token = authHead.split(" ")[1];
  const decoded = jwt.verify(token, '1766736');
  const investorId = decoded.id;
  const { amount, model, equity, revenue, duration } = req.body;
  const projectId = req.params.id;       
  const query = "SELECT * FROM projects WHERE id = ?";

  db.query(query, [projectId], (err, projectData) => {
    if( err) return res.status(500).json({ error: err.message });
    if (projectData.length === 0) return res.status(404).json({ error: 'Project not found' });
    const project = projectData[0];
    const entrepreneurId = project.userId;
    if (entrepreneurId === investorId) return res.status(403).json({ message: 'You cannot counter your own project' });
    const insertQuery = 'INSERT INTO investmentdeal (projectId, investorId, entrepreneurId, investmentAmount, investmentModel, equityPercentage, revenueSharePercentage, duration, dealStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      projectId,
      investorId,
      entrepreneurId,
      amount ,
      model ,
      equity ,
      revenue ,
      duration,
      'pending'
    ];
    console.log(values);
    db.query(insertQuery, values, async (err) => {
      if (err) return res.status(500).json({ error: err.message });

      return res.status(201).json({ message: 'Counter offer sent successfully' });
    })

  })
})


router.put('/contract/accept/:id', (req, res) => {
  const id = req.params.id;
const authHead = req.headers.authorization;

  if (!authHead) return res.status(401).json({ error: "Token is required" });

  try {
    const token = authHead.split(" ")[1];
    const decoded = jwt.verify(token, '1766736');
    const userId = decoded.id;

    const query = "SELECT entrepreneurId, projectId FROM contract WHERE id = ?";
    db.query(query, [id], (err, data) => {
      if (err) return res.status(500).json({ error: err.message });
      if (data.length === 0) return res.status(404).json({ message: 'Contract not found or declined' });

      if (userId != data[0].entrepreneurId)
        return res.status(403).json({ message: 'Only the entrepreneur can sign the contract' });

      const projectId = data[0].projectId;
      const checkQuery = "SELECT * FROM contract WHERE projectId = ? AND signed = ?";
      db.query(checkQuery, [projectId, 'signed'], (err2, data2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        if (data2.length > 0)
          return res.status(409).json({ message: 'Only one contract can be signed per project' });

        const signQuery = "UPDATE contract SET signed = ? WHERE id = ?";
        db.query(signQuery, ['signed', id], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          return res.status(200).json({ message: 'Contract signed successfully' });
        });
      });
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
});

router.delete('/contract/decline/:id',(req,res)=>{
  const id = req.params.id
 
  try {
    const query = "DELETE FROM contract WHERE id = ?"
    db.query(query,[id],(err)=>{
      if(err) return res.status(500).json({error:err.message})
      return res.status(200).json({message:'Contract Declined Successfully'})
    })
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
})


export default router;