const UssdMenu = require('ussd-menu-builder');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');

// Create a new UssdMenu instance with session configuration
let menu = new UssdMenu({
    sessionConfig: { timeout: 300000 } // 5 minutes session timeout
});

// Define USSD menu states and transitions
menu.startState({
    run: () => {
        menu.con('Welcome to the Voting System' +
            '\n1. Register' +
            '\n2. Vote' +
            '\n3. View Votes');
    },
    next: {
        '1': 'register',
        '2': 'vote',
        '3': 'viewVotes'
    }
});

// Handle user registration
menu.state('register', {
    run: () => {
        menu.con('Enter your Name:');
    },
    next: {
        '*': 'register.idNumber'
    }
});

// Handle user ID entry
menu.state('register.idNumber', {
    run: () => {
        let name = menu.val;
        menu.session.set('name', name);
        menu.con('Enter your ID Number:');
    },
    next: {
        '*': 'register.phoneNumber'
    }
});

// Handle user phone number entry
menu.state('register.phoneNumber', {
    run: () => {
        let idNumber = menu.val;
        menu.session.set('idNumber', idNumber);
        menu.con('Enter your Phone Number:');
    },
    next: {
        '*': 'register.save'
    }
});

// Handle saving user registration data
menu.state('register.save', {
    run: () => {
        let phoneNumber = menu.val;
        let name = menu.session.get('name');
        let idNumber = menu.session.get('idNumber');

        // Call User.register method to save user data
        User.register(name, idNumber, phoneNumber, (err, result) => {
            if (err) {
                menu.end('Registration failed');
            } else {
                menu.end('Registration successful');
            }
        });
    }
});

// Handle voting
menu.state('vote', {
    run: () => {
        menu.con('Select position to vote for:' +
            '\n1. Gluide President' +
            '\n2. Social Affairs' +
            '\n3. Minister of Security');
    },
    next: {
        '*': 'vote.candidates'
    }
});

// Handle selecting candidates for voting
menu.state('vote.candidates', {
    run: () => {
        let position = menu.val;
        menu.session.set('position', position);

        // Fetch candidates for the selected position
        Candidate.getAll((err, candidates) => {
            if (err) {
                menu.end('Error fetching candidates');
            } else {
                let response = 'Select candidate:';
                candidates.forEach((candidate, index) => {
                    response += `\n${index + 1}. ${candidate.name}`;
                });
                menu.con(response);
            }
        });
    },
    next: {
        '*': 'vote.save'
    }
});

// Handle saving the vote
menu.state('vote.save', {
    run: () => {
        let candidateIndex = menu.val - 1;
        let position = menu.session.get('position');
        let phoneNumber = menu.args.phoneNumber;

        // Fetch candidates again to validate the selected candidate
        Candidate.getAll((err, candidates) => {
            if (err || !candidates[candidateIndex]) {
                menu.end('Invalid candidate selection');
            } else {
                let candidateId = candidates[candidateIndex].id;

                // Check if the user has already voted for the position
                User.findByPhoneNumber(phoneNumber, (err, userResult) => {
                    if (err || userResult.length === 0) {
                        menu.end('User not found');
                    } else {
                        let userId = userResult[0].id;

                        Vote.checkVote(userId, position, (err, voteResult) => {
                            if (err) {
                                menu.end('Error checking vote');
                            } else if (voteResult.length > 0) {
                                menu.end('You have already voted for this position');
                            } else {
                                // Cast the vote
                                Vote.castVote(userId, position, candidateId, (err, result) => {
                                    if (err) {
                                        menu.end('Error casting vote');
                                    } else {
                                        menu.end('Vote cast successfully');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

// Handle viewing votes
menu.state('viewVotes', {
    run: () => {
        // Logic to view votes
        // Fetch candidates and votes for each position
        Candidate.getAll((err, candidates) => {
            if (err) {
                menu.end('Error fetching candidates');
            } else {
                const positions = ['Gluide President', 'Social Affairs', 'Minister of Security'];
                let response = '';

                positions.forEach(position => {
                    response += `\n${position}`;
                    candidates.forEach(candidate => {
                        Vote.countVotes(position, candidate.id, (err, result) => {
                            if (err) {
                                menu.end('Error counting votes');
                            } else {
                                response += `\n${candidate.name}: ${result[0].votes} votes`;
                            }
                        });
                    });
                });

                menu.end(response);
            }
        });
    }
});

// Set the default state to startState
menu.on('*', 'startState');

module.exports = menu;
