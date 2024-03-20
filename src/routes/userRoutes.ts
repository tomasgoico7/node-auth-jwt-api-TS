import express, { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/usersController"

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || "defualt-secret"

//Middleware para ver si estamos autenticados
const authenticationToken = (req : Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if(!token){
        return res.status(401).json({error: "No autorizado"})
    }

    jwt.verify(token, JWT_SECRET,(err, decoded) => {
        if(err){
            console.error("Error en la autenticacion")
            return res.status(403).json({error: "No tienes acceso"})
        }

        next()
    })
}

router.post("/",authenticationToken,createUser)
router.get("/",authenticationToken,getAllUsers)
router.get("/:id",authenticationToken,getUserById)
router.put("/:id",authenticationToken,updateUser)
router.delete("/:id",authenticationToken,deleteUser)

export default router