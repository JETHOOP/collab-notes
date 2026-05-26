import jwt from "jsonwebtoken"

const generateToken = (id) =>{
    return jwt.sign(
        {id} , nothingbutthesecrettoken , {expiresIn : "30d"}
    )
}

export default generateToken