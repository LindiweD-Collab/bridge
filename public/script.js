document.addEventListener('DOMContentLoaded', () => {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const currentYearSpan = document.getElementById('current-year');

    const setActiveLink = () => {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            link.classList.remove('active');
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    };
    setActiveLink();

    if (mobileNavToggle && mobileNav && mobileNavClose) {
        const closeMobileNav = () => mobileNav.classList.remove('open');
        mobileNavToggle.addEventListener('click', () => mobileNav.classList.add('open'));
        mobileNavClose.addEventListener('click', closeMobileNav);
        document.querySelectorAll('#mobile-nav .mobile-nav-link').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    const animatedElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.style.color = 'var(--slate-gray)';

            setTimeout(() => {
                formStatus.textContent = "Thank you! Your message has been sent.";
                formStatus.style.color = 'var(--accent-green)';
                contactForm.reset();
                setTimeout(() => { formStatus.textContent = ''; }, 5000);
            }, 1000);
        });
    }

    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});

const monthlyRadio = document.getElementById('monthly');
const adhocRadio = document.getElementById('adhoc');
const monthlyPlans = document.getElementById('monthly-plans');
const adhocServices = document.getElementById('adhoc-services');

if (monthlyRadio && adhocRadio && monthlyPlans && adhocServices) {
    monthlyRadio.addEventListener('change', () => {
        if (monthlyRadio.checked) {
            monthlyPlans.style.display = 'block';
            adhocServices.style.display = 'none';
        }
    });
    adhocRadio.addEventListener('change', () => {
        if (adhocRadio.checked) {
            monthlyPlans.style.display = 'none';
            adhocServices.style.display = 'block';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the cloud-readiness page
    if (document.getElementById('quiz-container')) {
        const questions = [
            {
                question: "How many employees will be using the cloud services?",
                options: ["1-10", "11-50", "51-200", "200+"],
                weights: { cost: [1, 2, 4, 8], readiness: [4, 3, 2, 1] }
            },
            {
                question: "What is your current server setup?",
                options: ["No servers", "On-premise physical servers", "Co-located / Hosted servers", "Already using some cloud services"],
                weights: { cost: [0, 4, 3, 1], readiness: [2, 1, 3, 4] }
            },
            {
                question: "How critical is 24/7 uptime for your primary applications?",
                options: ["Low - occasional downtime is acceptable", "Medium - important but not critical", "High - essential for business operations"],
                weights: { cost: [1, 3, 5], readiness: [2, 3, 4] }
            },
            {
                question: "Do you handle sensitive customer data (e.g., personal info, financials)?",
                options: ["No", "Yes, some", "Yes, a significant amount"],
                weights: { cost: [1, 3, 5], readiness: [2, 3, 4] }
            },
            {
                question: "What is your primary goal for moving to the cloud?",
                options: ["Cost savings", "Improve reliability & scalability", "Enhance security", "Enable remote work"],
                weights: { cost: [1, 3, 4, 2], readiness: [2, 4, 3, 3] }
            }
        ];

        let currentQuestionIndex = 0;
        let answers = {};

        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const questionCounter = document.getElementById('question-counter');
        const progressBar = document.getElementById('progress-bar');
        const restartBtn = document.getElementById('restart-btn');

        function showQuestion() {
            const currentQuestion = questions[currentQuestionIndex];
            questionText.textContent = currentQuestion.question;
            questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
            optionsContainer.innerHTML = '';

            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.className = 'btn';
                button.onclick = () => handleAnswer(option);
                optionsContainer.appendChild(button);
            });
            
            progressBar.style.width = `${(currentQuestionIndex / questions.length) * 100}%`;
        }
        
        function handleAnswer(option) {
            answers[currentQuestionIndex] = option;
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            } else {
                showResults();
            }
        }

        function showResults() {
            let costScore = 0;
            let readinessScore = 0;
            const maxReadinessScore = questions.length * 4;

            questions.forEach((q, index) => {
                const selectedOption = answers[index];
                const optionIndex = q.options.indexOf(selectedOption);
                costScore += q.weights.cost[optionIndex];
                readinessScore += q.weights.readiness[optionIndex];
            });

            const estimatedCost = 500 + costScore * 350;
            const readinessPercentage = Math.round((readinessScore / maxReadinessScore) * 100);

            let recommendation = "Based on your needs, a hybrid solution might be best.";
            if (readinessPercentage > 75) {
                recommendation = "You are a prime candidate for a full cloud migration to a scalable platform like AWS or Azure.";
            } else if (readinessPercentage > 50) {
                recommendation = "A phased migration to the cloud is recommended, starting with non-critical applications.";
            }

            document.getElementById('readiness-bar').style.width = `${readinessPercentage}%`;
            document.getElementById('readiness-text').textContent = `${readinessPercentage}%`;
            document.getElementById('cost-text').textContent = `R${estimatedCost.toLocaleString()} - R${(estimatedCost * 1.5).toLocaleString()}`;
            document.getElementById('recommendation-text').textContent = recommendation;
            
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
        }

        restartBtn.addEventListener('click', () => {
            currentQuestionIndex = 0;
            answers = {};
            resultsContainer.style.display = 'none';
            quizContainer.style.display = 'block';
            showQuestion();
        });

        // Start the quiz
        showQuestion();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the cyber-risk page
    if (document.getElementById('risk-quiz-container')) {
        const riskQuestions = [
            {
                question: "How do your employees manage their passwords?",
                options: ["We use a secure password manager", "We enforce strong, unique passwords", "Passwords are simple and reused", "I'm not sure"],
                risk: [0, 2, 8, 10],
                recommendation: "Implement a company-wide password manager to enforce strong, unique passwords for every service."
            },
            {
                question: "How often do you back up your critical business data?",
                options: ["Daily, automatically", "Weekly, manually", "Monthly or less often", "We don't have a backup system"],
                risk: [0, 4, 8, 10],
                recommendation: "Set up automated, daily cloud backups to protect your critical data from loss or ransomware."
            },
            {
                question: "Have your employees received any cybersecurity training?",
                options: ["Yes, regular, ongoing training", "Yes, once during onboarding", "No formal training", "I don't know"],
                risk: [0, 4, 8, 10],
                recommendation: "Schedule regular cybersecurity awareness training to teach your team how to spot phishing and other threats."
            },
            {
                question: "How do you protect your business from malware and viruses?",
                options: ["We use a modern endpoint protection suite (EDR)", "We have basic antivirus on all computers", "Only some computers have antivirus", "We have no specific protection"],
                risk: [0, 3, 8, 10],
                recommendation: "Ensure every device has modern endpoint protection (EDR) that is centrally managed and always up to date."
            },
            {
                question: "How quickly are critical software security patches applied?",
                options: ["Automatically, within days", "Within a few weeks", "It's done infrequently", "We don't update software"],
                risk: [0, 3, 8, 10],
                recommendation: "Implement a patch management policy to ensure all software is updated promptly to protect against vulnerabilities."
            }
        ];

        let riskCurrentIndex = 0;
        let riskAnswers = {};

        const quizContainer = document.getElementById('risk-quiz-container');
        const resultsContainer = document.getElementById('risk-results-container');
        const questionText = document.getElementById('risk-question-text');
        const optionsContainer = document.getElementById('risk-options-container');
        const questionCounter = document.getElementById('risk-question-counter');
        const progressBar = document.getElementById('risk-progress-bar');
        const restartBtn = document.getElementById('risk-restart-btn');

        function showRiskQuestion() {
            const currentQuestion = riskQuestions[riskCurrentIndex];
            questionText.textContent = currentQuestion.question;
            questionCounter.textContent = `Question ${riskCurrentIndex + 1} of ${riskQuestions.length}`;
            optionsContainer.innerHTML = '';
            
            currentQuestion.options.forEach(option => {
                const button = document.createElement('button');
                button.textContent = option;
                button.className = 'btn';
                button.onclick = () => handleRiskAnswer(option);
                optionsContainer.appendChild(button);
            });
            
            progressBar.style.width = `${(riskCurrentIndex / riskQuestions.length) * 100}%`;
        }
        
        function handleRiskAnswer(option) {
            riskAnswers[riskCurrentIndex] = option;
            if (riskCurrentIndex < riskQuestions.length - 1) {
                riskCurrentIndex++;
                showRiskQuestion();
            } else {
                showRiskResults();
            }
        }

        function showRiskResults() {
            let totalRiskScore = 0;
            const recommendations = [];

            riskQuestions.forEach((q, index) => {
                const selectedOption = riskAnswers[index];
                const optionIndex = q.options.indexOf(selectedOption);
                const riskValue = q.risk[optionIndex];
                totalRiskScore += riskValue;
                
                // Add recommendation if the answer indicates a high-risk practice (risk value > 5)
                if (riskValue > 5) {
                    recommendations.push(q.recommendation);
                }
            });

            const badge = document.getElementById('risk-level-badge');
            if (totalRiskScore < 15) {
                badge.textContent = 'Low Risk';
                badge.className = 'risk-badge low';
            } else if (totalRiskScore < 35) {
                badge.textContent = 'Medium Risk';
                badge.className = 'risk-badge medium';
            } else {
                badge.textContent = 'High Risk';
                badge.className = 'risk-badge high';
            }

            const recommendationList = document.getElementById('recommendation-list');
            recommendationList.innerHTML = '';
            if (recommendations.length > 0) {
                 recommendations.forEach(rec => {
                    const li = document.createElement('li');
                    li.innerHTML = `<div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div><div>${rec}</div>`;
                    recommendationList.appendChild(li);
                });
            } else {
                 const li = document.createElement('li');
                 li.innerHTML = `<div>Great job! Your foundational security practices look solid. We can help you enhance them further with proactive monitoring and advanced threat protection.</div>`;
                 recommendationList.appendChild(li);
            }
            
            quizContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
        }

        restartBtn.addEventListener('click', () => {
            riskCurrentIndex = 0;
            riskAnswers = {};
            resultsContainer.style.display = 'none';
            quizContainer.style.display = 'block';
            showRiskQuestion();
        });

        // Start the quiz
        showRiskQuestion();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the RPA calculator page
    if (document.getElementById('rpa-form')) {
        const rpaForm = document.getElementById('rpa-form');
        const timeSavedEl = document.getElementById('time-saved');
        const moneySavedEl = document.getElementById('money-saved');
        const resultsMessage = document.getElementById('results-message');
        const ctaButton = document.getElementById('cta-button');

        function calculateRPASavings() {
            // Get values from the form
            const taskTime = parseFloat(document.getElementById('task-time').value);
            const taskFrequency = parseFloat(document.getElementById('task-frequency').value);
            const employeeCount = parseFloat(document.getElementById('employee-count').value);
            const employeeCost = parseFloat(document.getElementById('employee-cost').value);

            // --- Calculations ---
            // Calculate total minutes spent per week
            const totalMinutesPerWeek = taskTime * taskFrequency * employeeCount;
            // Convert to hours per year (assuming 52 weeks)
            const hoursPerYear = (totalMinutesPerWeek / 60) * 52;
            // Calculate total annual cost
            const annualCost = hoursPerYear * employeeCost;
            
            // --- Display Results ---
            // Assuming RPA bot does the work in 10% of the time, saving 90%
            const timeSaved = hoursPerYear * 0.90;
            const moneySaved = annualCost * 0.90;

            timeSavedEl.textContent = `${Math.round(timeSaved).toLocaleString()} Hours/Year`;
            moneySavedEl.textContent = `R ${Math.round(moneySaved).toLocaleString()}/Year`;
            
            resultsMessage.textContent = "This is the potential value you could reinvest into growing your business.";
            ctaButton.style.display = 'inline-block';
        }

        rpaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateRPASavings();
        });

        // Run calculation on page load with default values
        calculateRPASavings();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the RPA calculator page
    if (document.getElementById('rpa-form')) {
        // ... (your existing RPA form and calculation code is here) ...

        const ctaButton = document.getElementById('cta-button');
        const signupModal = document.getElementById('signup-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const signupForm = document.getElementById('signup-form');
        const modalStatus = document.getElementById('modal-status');
        const submitSignupBtn = document.getElementById('submit-signup-btn');

        // --- NEW MODAL LOGIC ---

        // Show the modal when the CTA button is clicked
        ctaButton.addEventListener('click', () => {
            signupModal.style.display = 'flex';
        });

        // Hide the modal
        const closeModal = () => {
            signupModal.style.display = 'none';
            modalStatus.textContent = ''; // Clear any status messages
        };

        closeModalBtn.addEventListener('click', closeModal);
        // Also close modal if user clicks on the dark overlay
        signupModal.addEventListener('click', (e) => {
            if (e.target === signupModal) {
                closeModal();
            }
        });

        // Handle the signup form submission
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('signup-email').value;
            
            // Get the calculated savings from the results display
            const timeSaved = document.getElementById('time-saved').textContent;
            const moneySaved = document.getElementById('money-saved').textContent;
            
            // Put savings data into hidden fields
            document.getElementById('hidden-time-saved').value = timeSaved;
            document.getElementById('hidden-money-saved').value = moneySaved;

            submitSignupBtn.disabled = true;
            modalStatus.textContent = 'Submitting...';

            const formData = new FormData(signupForm);
            // Append your new access key
            formData.append("access_key", "e79fd123-332f-4645-b01b-ab2083a37bb9"); 
            formData.append("email", email);
            formData.append("subject", "New RPA Lead from Website Calculator!"); 

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    modalStatus.textContent = "Thank you! We'll be in touch shortly.";
                    signupForm.reset();
                    setTimeout(() => {
                        closeModal();
                    }, 3000); // Close modal after 3 seconds
                } else {
                    modalStatus.textContent = "Oops! Something went wrong.";
                }
                submitSignupBtn.disabled = false;
            })
            .catch(error => {
                modalStatus.textContent = "Error submitting form.";
                submitSignupBtn.disabled = false;
            });
        });
       
        function calculateRPASavings() {
             //... (existing calculation code) ...
        }
        rpaForm.addEventListener('submit', (e) => {
             e.preventDefault();
             calculateRPASavings();
        });
        calculateRPASavings();
    }
});