import bcrypt from 'bcryptjs';
import Creator from '../models/creator.model.js';
import generateTokenAndSetCookie from '../utils/genTokenAndCookie.js';
import Volunteer from '../models/volunteer.model.js';

export const creatorLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Please fill in all fields');
    }

    try {
        const creator = await Creator
            .findOne({ username })
            .select('+password');

        if (!creator) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, creator?.password || "");

        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        generateTokenAndSetCookie(creator._id, true, res);

        const creatorData = creator.toObject();
        delete creatorData.password;

        return res.status(200).json(creatorData);
    } catch (error) {
        console.log("Creator Login Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const creatorRegister = async (req, res) => {
    const { fullName, username, email, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
        return res.status(400).send('Please fill in all fields');
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

        return res.status(201).json(creator);
    } catch (error) {
        console.log("Creator Register Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const creatorLogout = async (req, res) => {
    try {
        res.cookie("_creator_token", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out" });
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

        return res.status(200).json(volunteerData);
    } catch (error) {
        console.log("Volunteer Login Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const volunteerRegister = async (req, res) => {
    const { fullName, username, email, password, confirmPassword, gender } = req.body;

    if (!fullName || !username || !email || !password || !confirmPassword || !gender) {
        return res.status(400).send('Please fill in all fields');
    }

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const existing = await Creator.findOne({ username, email });
        if (existing) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newVolunteer = await Volunteer.create({ fullName, username, email, password: hashedPassword, gender });

        generateTokenAndSetCookie(newVolunteer._id, false, res);

        await newVolunteer.save();

        const volunteer = newVolunteer.toObject();
        delete volunteer.password;

        return res.status(201).json(volunteer);
    } catch (error) {
        console.log("Creator Register Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}

export const volunteerLogout = async (req, res) => {
    try {
        res.cookie("_volunteer_token", "", { maxAge: 0 });
        return res.status(200).json({ message: "Logged out" });
    } catch (error) {
        console.log("Creator Logout Error:\n", error);
        return res.status(500).json({ error: error.message });
    }
}