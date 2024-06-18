const express = require ('express')
const router = express.Router()
const AdminDash = require('../Controllers/AdminDash')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/clients')

    .get(AdminDash.getAllClients)
    .delete(AdminDash.DeleteUser)
    

module.exports = router 

router.route('/employes')

    .get(AdminDash.getAllEmployes)
    .delete(AdminDash.DeleteUser)
    

module.exports = router 



router.route('/jobrequests')

    .get(AdminDash.getAllJobRequests)
    .post(AdminDash.AccpetJobRequest)
    .delete(AdminDash.RefuseJobRequest)

module.exports = router 

router.route('/sessionsrequests')

    .get(AdminDash.getSessionsRequests)
    .patch(AdminDash.AccpetSessionsRequests)
    .delete(AdminDash.RefuseSessionRequest)

module.exports = router 

router.route('/feedbacks')

    .get(AdminDash.getFeedBack)
    .patch(AdminDash.AcceptFeedBack)
    .delete(AdminDash.RefuseFeedBack)

module.exports = router 

router.route('/reports')

    .get(AdminDash.getReports)

module.exports = router