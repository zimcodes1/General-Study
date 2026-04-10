const sampleCatalogueContent = {
	subtopics: [
		"Definition of Software",
		"Software Engineering vs Programming",
		"Software Crisis and Goals of Software Engineering",
		"Definition and Scope of Software Engineering",
		"Characteristics, Components, and Process Orientation",
		"Traditional vs Modern Software Systems and Delivery Models",
		"Computing Curricula",
		"Software Engineering Curriculum Guidelines",
		"The Mythical Man-Month (Brooks, 1975)",
	],
	summaries: [
		"Software consists of programs, data, and documentation, and it is intangible but essential for giving purpose to hardware.",
		"Software engineering applies engineering principles to build complete software systems, whereas programming focuses only on writing code; engineering emphasizes process, quality, and long\u2011term maintenance.",
		"The early software crisis\u2014projects delivered late, over budget, or unreliable\u2014led to software engineering, which aims to improve reliability, reduce cost, manage complexity, and achieve goals such as correctness, efficiency, and scalability.",
		"Software engineering is a professional engineering discipline that integrates computer science, project management, human\u2011computer interaction, systems engineering, and ethics, focusing beyond coding to systematic development.",
		"It is process\u2011driven, documentation\u2011oriented, team\u2011based, quality\u2011focused, and lifecycle\u2011oriented, considering product, people, processes, tools, and environment as essential components.",
		"Traditional software runs locally on a single machine with manual updates, whereas modern service\u2011oriented software is delivered over the internet, accessed anywhere, continuously updated, and can scale automatically.",
		"Computing curricula define the knowledge areas and learning outcomes that students should acquire in computer science programs.",
		"Software engineering curriculum guidelines provide a structured framework for teaching engineering principles, processes, and best practices specific to software development.",
		'Brooks\' "The Mythical Man-Month" highlights the challenges of software project management, famously noting that adding manpower to a late project often makes it later.',
	],
	quiz_questions: [
		{
			question:
				"Which of the following is NOT considered a component of software?",
			options: ["Programs", "Data", "Documentation", "Hardware"],
			answer: "Hardware",
			explanation:
				"Software is made up of programs, data, and documentation; hardware is a separate physical component.",
		},
		{
			question:
				"What was a primary reason for the emergence of software engineering?",
			options: [
				"To make software look pretty",
				"To reduce cost and failure of software projects",
				"To eliminate the need for programming",
				"To increase hardware speed",
			],
			answer: "To reduce cost and failure of software projects",
			explanation:
				"The software crisis highlighted late deliveries, budget overruns, and unreliable systems, prompting software engineering to introduce discipline that reduces cost and failure.",
		},
		{
			question:
				"Which of the following best describes the scope of software engineering?",
			options: [
				"Only writing source code",
				"Integrating multiple disciplines such as computer science, project management, and ethics",
				"Managing hardware only",
				"Designing user interfaces exclusively",
			],
			answer:
				"Integrating multiple disciplines such as computer science, project management, and ethics",
			explanation:
				"Software engineering combines knowledge from several fields, not just coding or UI design, to create reliable, maintainable software.",
		},
		{
			question:
				"What distinguishes modern service\u2011oriented software from traditional installed software?",
			options: [
				"It runs on a single computer",
				"Updates require manual installation",
				"It is delivered as a continuously updated internet service that can scale automatically",
				"It cannot be accessed remotely",
			],
			answer:
				"It is delivered as a continuously updated internet service that can scale automatically",
			explanation:
				"Modern software is accessed via the internet, receives automatic updates, and can scale with demand, unlike traditional software that is installed locally and updated manually.",
		},
		{
			question: "What is the main purpose of computing curricula?",
			options: [
				"To outline essential knowledge and skills for computer science students",
				"To prescribe specific programming languages to be used",
				"To enforce a uniform grading system across all institutions",
				"To limit the number of courses a student can take",
			],
			answer:
				"To outline essential knowledge and skills for computer science students",
			explanation:
				"Computing curricula are designed to define the core concepts and competencies that students should master, not to dictate specific tools or grading policies.",
		},
		{
			question:
				'According to Brooks in "The Mythical Man-Month," what happens when you add more people to a late software project?',
			options: [
				"The project finishes earlier because more work gets done",
				"The project is likely to be delayed further due to increased communication overhead",
				"The quality of the software automatically improves",
				"The project cost decreases proportionally",
			],
			answer:
				"The project is likely to be delayed further due to increased communication overhead",
			explanation:
				"Brooks observed that adding manpower to a delayed project often introduces additional coordination costs, which can extend the schedule rather than shorten it.",
		},
	],
};
