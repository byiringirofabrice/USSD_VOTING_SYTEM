const Vote = require('../models/Vote');
const User = require('../models/User');
const Candidate = require('../models/Candidate');

exports.castVote = (req, res) => {
    const { phoneNumber, position, candidateId } = req.body;

    User.findByPhoneNumber(phoneNumber, (err, userResult) => {
        if (err || userResult.length === 0) {
            return res.status(404).send('User not found');
        }

        const userId = userResult[0].id;

        Vote.checkVote(userId, position, (err, voteResult) => {
            if (err) {
                return res.status(500).send('Error checking vote');
            }

            if (voteResult.length > 0) {
                return res.send('You have already voted for this position');
            }

            Vote.castVote(userId, position, candidateId, (err, result) => {
                if (err) {
                    return res.status(500).send('Error casting vote');
                }
                res.send('Vote cast successfully');
            });
        });
    });
};

exports.viewVotes = (req, res) => {
    Candidate.getAll((err, candidates) => {
        if (err) {
            return res.status(500).send('Error fetching candidates');
        }

        const positions = ['Gluide President', 'Social Affairs', 'Minister of Security'];
        let votes = [];

        positions.forEach((position, index) => {
            candidates.forEach((candidate) => {
                Vote.countVotes(position, candidate.id, (err, result) => {
                    if (err) {
                        return res.status(500).send('Error counting votes');
                    }

                    votes.push({
                        position,
                        candidate: candidate.name,
                        votes: result[0].votes
                    });

                    if (index === positions.length - 1 && candidate.id === candidates.length) {
                        res.json(votes);
                    }
                });
            });
        });
    });
};
