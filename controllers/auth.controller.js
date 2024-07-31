import bcrypt from 'bcryptjs';
import Creator from '../models/creator.model.js';
import generateTokenAndSetCookie from '../utils/genTokenAndCookie.js';
import Volunteer from '../models/volunteer.model.js';

export const creatorLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    try {
        const creator = await Creator
            .findOne({ username })
            .select('+password');

        if (!creator) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, creator?.password || "");

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        generateTokenAndSetCookie(creator._id, true, res);

        const creatorData = creator.toObject();
        delete creatorData.password;

        return res.status(200)
            .json(creatorData)
        // .redirect('/src/dashboard/creatorDashboard/')
    } catch (error) {
        console.log("Creator Login Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const creatorRegister = async (req, res) => {
    const { fullName, username, email, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const existing = await Creator.findOne({ username, email });
        if (existing) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCreator = await Creator.create({ fullName, username, email, password: hashedPassword, gender });

        generateTokenAndSetCookie(newCreator._id, true, res);

        await newCreator.save();

        const creator = newCreator.toObject();
        delete creator.password;

        return res.status(201).json(creator)
        // .redirect('/src/dashboard/creatorDashboard/');
    } catch (error) {
        console.log("Creator Register Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const creatorLogout = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("creator_token", "", { maxAge: 0 })
            .json({ message: "Logged out" })
            // .redirect('/joinUs/');
    } catch (error) {
        console.log("Creator Logout Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const volunteerLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    try {
        const volunteer = await Volunteer.findOne({ username }).select('+password');

        if (!volunteer) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, volunteer?.password || "");

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        generateTokenAndSetCookie(volunteer._id, false, res);

        const volunteerData = volunteer.toObject();
        delete volunteerData.password

        return res.status(200).json(volunteerData)
        // .redirect('/src/dashboard/volunteerDashboard/');
    } catch (error) {
        console.log("Volunteer Login Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const volunteerRegister = async (req, res) => {
    const { fullName, username, email, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existing = await Volunteer.findOne({ username, email });
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newVolunteer = await Volunteer.create({ fullName, username, email, password: hashedPassword, gender });

        generateTokenAndSetCookie(newVolunteer._id, false, res);

        await newVolunteer.save();

        const volunteer = newVolunteer.toObject();
        delete volunteer.password;

        return res.status(201).json(volunteer)
        // .redirect('/src/dashboard/volunteerDashboard/');
    } catch (error) {
        console.log("Volunteer Register Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const volunteerLogout = async (req, res) => {
    try {
        return res
            .status(200)
            .cookie("volunteer_token", "", { maxAge: 0 })
            .json({ message: "Logged out" })
        // .redirect('/joinUs/')
    } catch (error) {
        console.log("Volunteer Logout Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}