const jobs = [
  {
    id: "50123abcde01",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "Software Engineer",
    division: "Engineering",
    location: "Bangalore, India",
    level: "Fresher",
    min_qualifications: [
      "Bachelor's degree in Computer Science or related field",
      "Basic understanding of JavaScript, Python, or Java",
      "Familiarity with version control systems (e.g., Git)",
    ],
    preferred_qualifications: [
      "Internship experience in software development",
      "Exposure to front-end or back-end development",
      "Strong problem-solving skills",
    ],
    about: (
      <div className="space-y-4">
        <p>
          At Cipherwill, we're looking for a passionate Software Engineer
          to join our dynamic engineering team. This role is perfect for fresh
          graduates who are eager to apply their knowledge and learn hands-on in
          a collaborative and innovative environment. You'll be working on
          developing secure, scalable, and user-friendly solutions that empower
          individuals to manage and transfer their digital legacy.
        </p>
        <p>
          As a fresher, you'll receive mentorship from experienced
          engineers, gain exposure to modern technologies, and actively
          contribute to the development of key features. This is a fantastic
          opportunity to grow your skills and build a meaningful career in the
          tech industry.
        </p>
      </div>
    ),
    responsibilities: [
      "Assist in developing and testing platform features",
      "Collaborate with team members on design and implementation",
      "Participate in code reviews and knowledge-sharing sessions",
    ],
  },
  {
    id: "50123abcde02",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "Full-Stack Developer",
    division: "Engineering",
    location: "Bangalore, India",
    level: "Fresher",
    min_qualifications: [
      "Bachelor's degree in Computer Science or related field",
      "Knowledge of front-end and back-end technologies",
      "Eagerness to learn and adapt to new frameworks",
    ],
    preferred_qualifications: [
      "Hands-on project experience during academics",
      "Understanding of REST APIs and databases",
      "Ability to work in a collaborative environment",
    ],
    about: (
      <div className="space-y-4">
        <p>
          Join Cipherwill's engineering team as a Full-Stack Developer and
          kick-start your career in one of the most versatile and exciting roles
          in tech. As a fresher, you'll contribute to both front-end and
          back-end development, ensuring that our platform delivers a seamless
          experience to users while maintaining high security standards.
        </p>
        <p>
          You'll work on real-world projects, from developing new features
          to optimizing performance and usability. This role offers exposure to
          a range of technologies and encourages creative problem-solving,
          giving you a solid foundation for your future as a developer.
        </p>
      </div>
    ),
    responsibilities: [
      "Develop and maintain both front-end and back-end features",
      "Work on debugging and testing modules",
      "Assist in ensuring responsive and accessible user interfaces",
    ],
  },
  {
    id: "50123abcde03",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "Back-End Developer",
    division: "Engineering",
    location: "Bangalore, India",
    level: "Fresher",
    min_qualifications: [
      "Bachelor's degree in Computer Science or related field",
      "Basic knowledge of server-side programming languages like Python or Node.js",
      "Understanding of database concepts",
    ],
    preferred_qualifications: [
      "Experience with NoSQL or relational databases",
      "Understanding of API development",
      "Basic understanding of cloud platforms",
    ],
    about: (
      <div className="space-y-4">
        <p>
          Cipherwill is seeking a Back-End Developer who is enthusiastic about
          creating robust and scalable solutions. This role is ideal for fresh
          graduates who are passionate about building and maintaining
          server-side functionality, ensuring the stability and efficiency of
          our platform.
        </p>
        <p>
          As part of the team, you'll work on implementing APIs, managing
          databases, and enhancing the performance of our back-end systems. With
          guidance from experienced mentors, you'll have the chance to hone
          your technical skills and contribute to meaningful projects.
        </p>
      </div>
    ),
    responsibilities: [
      "Assist in designing and developing APIs",
      "Ensure optimal performance of the back-end system",
      "Collaborate with front-end developers to integrate user-facing elements",
    ],
  },
  {
    id: "50123abcde04",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "Senior Software Engineer",
    division: "Engineering",
    location: "Bangalore, India",
    level: "Mid",
    min_qualifications: [
      "3+ years of experience in software development",
      "Strong knowledge of JavaScript and modern frameworks like React.js or Vue.js",
      "Experience in building scalable systems",
    ],
    preferred_qualifications: [
      "Experience in cloud infrastructure (AWS, Azure, or GCP)",
      "Knowledge of CI/CD pipelines",
      "Leadership experience in agile teams",
    ],
    about: (
      <div className="space-y-4">
        <p>
          Cipherwill is looking for a Senior Software Engineer to lead the
          development of our secure digital legacy management platform. In this
          role, you'll leverage your experience to design and implement
          scalable solutions, mentor junior engineers, and ensure the overall
          technical excellence of the team.
        </p>
        <p>
          This position offers the opportunity to work on complex, cutting-edge
          challenges in cloud-based systems, encryption, and distributed
          architectures. If you're passionate about building impactful
          software and shaping the direction of a growing platform, this role is
          for you.
        </p>
      </div>
    ),
    responsibilities: [
      "Design, develop, and deploy scalable software solutions",
      "Mentor junior engineers and conduct code reviews",
      "Collaborate with cross-functional teams to align on goals",
    ],
  },
  {
    id: "50123abcde05",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "DevOps Engineer",
    division: "Engineering",
    location: "Bangalore, India",
    level: "Mid",
    min_qualifications: [
      "2+ years of experience in DevOps roles",
      "Proficiency in CI/CD pipelines and containerization tools (Docker, Kubernetes)",
      "Experience with infrastructure as code tools like Terraform or Ansible",
    ],
    preferred_qualifications: [
      "Experience in monitoring tools like Prometheus or Grafana",
      "Knowledge of cloud platforms (AWS, GCP, Azure)",
      "Strong scripting skills in Python or Bash",
    ],
    about: (
      <div className="space-y-4">
        <p>
          As a DevOps Engineer at Cipherwill, you will play a crucial role in
          maintaining and optimizing our platform's infrastructure. This role
          requires expertise in automation, monitoring, and deployment processes
          to ensure our platform remains reliable and secure.
        </p>
        <p>
          You'll collaborate with cross-functional teams to build efficient
          CI/CD pipelines, manage cloud infrastructure, and monitor system
          performance. Join us to take ownership of platform scalability and
          contribute to a seamless user experience.
        </p>
      </div>
    ),
    responsibilities: [
      "Design and maintain CI/CD pipelines",
      "Monitor and optimize system performance",
      "Ensure platform reliability and scalability",
    ],
  },
  {
    id: "50123abcde06",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "Product Manager",
    division: "Product",
    location: "Bangalore, India",
    level: "Mid",
    min_qualifications: [
      "3+ years of product management experience",
      "Strong understanding of user-centered design principles",
      "Proven ability to work with cross-functional teams",
    ],
    preferred_qualifications: [
      "Experience in SaaS or digital asset management solutions",
      "Analytical mindset with proficiency in product metrics",
      "Excellent communication skills",
    ],
    about: (
      <div className="space-y-4">
        <p>
          Cipherwill is hiring a Product Manager to lead the strategy and
          execution of our digital legacy management platform. This role
          involves defining product roadmaps, collaborating with engineering and
          design teams, and ensuring that we meet the needs of our users
          effectively.
        </p>
        <p>
          If you're passionate about creating user-centric products and
          enjoy working in a fast-paced environment, this position offers the
          opportunity to shape the future of a platform that helps people manage
          their digital assets with confidence.
        </p>
      </div>
    ),
    responsibilities: [
      "Define product vision and roadmap",
      "Collaborate with engineering and design teams",
      "Analyze product performance and user feedback",
    ],
  },
  {
    id: "50123abcde07",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "Associate Product Manager",
    division: "Product",
    location: "Bangalore, India",
    level: "Fresher",
    min_qualifications: [
      "Bachelor’s degree in Business, Engineering, or related field",
      "Strong analytical and problem-solving skills",
      "Interest in product development and strategy",
    ],
    preferred_qualifications: [
      "Internship experience in product or project management",
      "Knowledge of Agile methodologies",
      "Excellent organizational skills",
    ],
    about: (
      <div className="space-y-4">
        <p>
          As an Associate Product Manager at Cipherwill, you will assist in
          building products that truly make a difference. This role is perfect
          for fresh graduates or those with limited experience, as it provides
          hands-on exposure to product strategy, development, and execution.
        </p>
        <p>
          You'll work closely with senior product managers, engineers, and
          designers to gather insights, define product requirements, and track
          performance metrics. This is an excellent opportunity to develop your
          skills and grow into a seasoned product professional.
        </p>
      </div>
    ),
    responsibilities: [
      "Assist in defining product requirements",
      "Collaborate with stakeholders to prioritize tasks",
      "Track product performance metrics",
    ],
  },
  {
    id: "50123abcde08",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "UI/UX Designer",
    division: "Design",
    location: "Bangalore, India",
    level: "Mid",
    min_qualifications: [
      "3+ years of experience in UI/UX design",
      "Proficiency in design tools like Figma, Sketch, or Adobe XD",
      "Strong portfolio showcasing user-friendly designs",
    ],
    preferred_qualifications: [
      "Experience in SaaS product design",
      "Knowledge of design systems and accessibility standards",
      "Strong collaboration skills with cross-functional teams",
    ],
    about: (
      <div className="space-y-4">
        <p>
          Cipherwill is seeking a creative and experienced UI/UX Designer to
          craft intuitive, engaging, and visually appealing user experiences. In
          this role, you'll work closely with product and engineering teams
          to design interfaces that make managing digital legacies simple and
          seamless.
        </p>
        <p>
          You'll take ownership of the entire design process, from ideation
          to delivery, ensuring that our platform not only meets but exceeds
          user expectations. If you're passionate about user-centered
          design, this is your chance to make an impact.
        </p>
      </div>
    ),
    responsibilities: [
      "Design user interfaces and prototypes",
      "Collaborate with product and engineering teams",
      "Ensure designs align with user needs and business goals",
    ],
  },
  {
    id: "50123abcde09",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "Graphic Designer",
    division: "Design",
    location: "Bangalore, India",
    level: "Fresher",
    min_qualifications: [
      "Bachelor’s degree in Design or related field",
      "Proficiency in design tools like Photoshop, Illustrator, or Canva",
      "Strong creative and visual communication skills",
    ],
    preferred_qualifications: [
      "Experience with branding or marketing materials",
      "Portfolio showcasing design projects",
      "Basic knowledge of motion graphics",
    ],
    about: (
      <div className="space-y-4">
        <p>
          We are looking for a Graphic Designer to join Cipherwill and bring our
          brand to life. This role involves creating visually compelling designs
          for web, marketing campaigns, and other digital assets that
          communicate our mission effectively to users.
        </p>
        <p>
          As part of the team, you'll collaborate with marketing and
          product teams to ensure consistency in branding and design. If you
          have a keen eye for detail and a flair for creativity, we'd love
          to see your portfolio!
        </p>
      </div>
    ),
    responsibilities: [
      "Create graphics for web and marketing campaigns",
      "Work with teams to ensure brand consistency",
      "Contribute to brainstorming and creative processes",
    ],
  },
  {
    id: "50123abcde10",
    datePosted: "2024-01-25",
    validThrough: "2028-01-01",
    title: "HR and Legal Associate",
    division: "HR and Legal",
    location: "Bangalore, India",
    level: "Mid",
    min_qualifications: [
      "3+ years of experience in HR or legal roles",
      "Knowledge of employment laws and compliance",
      "Strong interpersonal and organizational skills",
    ],
    preferred_qualifications: [
      "Experience in HR processes for tech companies",
      "Strong negotiation and contract drafting skills",
      "Ability to manage confidential information",
    ],
    about: (
      <div className="space-y-4">
        <p>
          Join Cipherwill as an HR and Legal Associate to help shape and
          maintain a positive and compliant work environment. This role involves
          overseeing recruitment, managing employee relations, and ensuring
          compliance with employment laws and regulations.
        </p>
        <p>
          You'll work closely with leadership to draft policies, review
          contracts, and support team growth. If you're organized,
          detail-oriented, and passionate about HR and legal processes, this
          role offers a unique opportunity to contribute to our mission.
        </p>
      </div>
    ),
    responsibilities: [
      "Handle recruitment and onboarding processes",
      "Ensure compliance with employment regulations",
      "Draft and review contracts and policies",
    ],
  },
];
export default jobs;
