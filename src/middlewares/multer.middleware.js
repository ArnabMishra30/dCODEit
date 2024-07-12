import multer from 'multer'

//here we have used disk-storage form multer
//github link :--- https://github.com/expressjs/multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        //avoiding below file naming structure for now as we don't need to configure the file name
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname) // this may be problematic sometimes because if two user uplods same named file at same time than it thorws error
        //but as we storing i in local for a tiny amount of time so that we can keep it
    }
})

export const upload = multer({ storage: storage })