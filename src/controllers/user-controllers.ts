import { NextFunction, Request, Response } from 'express'
import User from '../models/User.js'
import { compare, hash } from 'bcrypt'
import { createToken } from '../utils/token-manager.js'
import { COOKIE_NAME } from '../utils/constants.js'

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await User.find()
    return res.status(200).json({ message: 'OK', allUsers })
  } catch (error) {
    return res.status(200).json({ message: 'ERROR', cause: error.message })
  }
}

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(401).send('User already registered')
    const hashedPassword = await hash(password, 10)
    const newUser = new User({ name, email, password: hashedPassword })

    await newUser.save()

    //create token and store
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: 'localhost',
      signed: true,
      path: '/',
    })

    const token = createToken(newUser._id.toString(), newUser.email, '7d')
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    res.cookie(COOKIE_NAME, token, {
      path: '/',
      domain: 'localhost',
      expires,
      httpOnly: true,
      signed: true,
    })

    return res.status(201).json({
      message: 'OK',
      name: newUser.name,
      email: newUser.email,
    })
  } catch (error) {
    return res.status(500).json({ message: 'ERROR', cause: error.message })
  }
}

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(401).send('User not registered')
    }
    const isPasswordCorrect = await compare(password, existingUser.password)
    if (!isPasswordCorrect) {
      return res.status(403).send('Incorrect password')
    }
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: 'localhost',
      signed: true,
      path: '/',
    })

    const token = createToken(
      existingUser._id.toString(),
      existingUser.email,
      '7d'
    )
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    res.cookie(COOKIE_NAME, token, {
      path: '/',
      domain: 'localhost',
      expires,
      httpOnly: true,
      signed: true,
    })

    return res.status(200).json({
      message: 'OK',
      name: existingUser.name,
      email: existingUser.email,
    })
  } catch (error) {
    return res.status(200).json({ message: 'ERROR', cause: error.message })
  }
}

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingUser = await User.findById(res.locals.jwtData.id)
    if (!existingUser) {
      return res.status(401).send('User not registered OR token malfunction')
    }
    if (existingUser._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send('Permissions did not match')
    }

    return res.status(200).json({
      message: 'OK',
      name: existingUser.name,
      email: existingUser.email,
    })
  } catch (error) {
    return res.status(200).json({ message: 'ERROR', cause: error.message })
  }
}

export const userLogout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingUser = await User.findById(res.locals.jwtData.id)
    if (!existingUser) {
      return res.status(401).send('User not registered OR token malfunction')
    }
    if (existingUser._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send('Permissions did not match')
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      domain: 'localhost',
      signed: true,
      path: '/',
    })

    return res.status(200).json({
      message: 'OK',
      name: existingUser.name,
      email: existingUser.email,
    })
  } catch (error) {
    return res.status(200).json({ message: 'ERROR', cause: error.message })
  }
}
