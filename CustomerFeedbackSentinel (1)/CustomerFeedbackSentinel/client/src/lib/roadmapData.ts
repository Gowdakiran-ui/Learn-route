import { RoadmapStep } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

// Function to generate a roadmap based on a category
export function generateRoadmap(category: string): RoadmapStep[] {
  switch (category) {
    case "web-development":
      return webDevelopmentRoadmap;
    case "data-science":
      return dataScienceRoadmap;
    case "machine-learning":
      return machineLearningRoadmap;
    case "mobile-development":
      return mobileDevelopmentRoadmap;
    case "blockchain":
      return blockchainRoadmap;
    case "cloud-computing":
      return cloudComputingRoadmap;
    case "devops":
      return devopsRoadmap;
    default:
      return webDevelopmentRoadmap; // Default to web development
  }
}

// Sample roadmap for Web Development
const webDevelopmentRoadmap: RoadmapStep[] = [
  {
    id: uuidv4(),
    title: "HTML & CSS Fundamentals",
    description: "Learn the basics of HTML5 and CSS3, the building blocks of web development.",
    resourceIds: [1, 2],
    completed: false
  },
  {
    id: uuidv4(),
    title: "JavaScript Essentials",
    description: "Master the core concepts of JavaScript programming language.",
    resourceIds: [2, 3],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Frontend Frameworks",
    description: "Learn popular frontend frameworks like React, Angular, or Vue.",
    resourceIds: [4, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Backend Development",
    description: "Explore server-side programming with Node.js, Express, and databases.",
    resourceIds: [6, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Responsive Design & Accessibility",
    description: "Create websites that work well on all devices and are accessible to everyone.",
    resourceIds: [1, 3],
    completed: false
  },
  {
    id: uuidv4(),
    title: "API Development & Integration",
    description: "Learn to create and consume APIs for connecting services and data sources.",
    resourceIds: [5, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Deployment & DevOps",
    description: "Understand how to deploy websites and set up continuous integration.",
    resourceIds: [8, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Advanced Frontend Techniques",
    description: "Master advanced concepts like state management, performance optimization, and animations.",
    resourceIds: [4, 6],
    completed: false
  }
];

// Sample roadmap for Data Science
const dataScienceRoadmap: RoadmapStep[] = [
  {
    id: uuidv4(),
    title: "Python Basics",
    description: "Learn the fundamentals of Python programming language for data analysis.",
    resourceIds: [4, 8],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Data Manipulation with Pandas",
    description: "Master data cleaning, transformation, and analysis with Pandas library.",
    resourceIds: [3, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Data Visualization",
    description: "Learn to create meaningful visualizations with Matplotlib, Seaborn, and Plotly.",
    resourceIds: [2, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "SQL & Database Management",
    description: "Understand how to query and manage databases for data extraction.",
    resourceIds: [1, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Statistical Analysis",
    description: "Master statistical concepts and hypothesis testing for data interpretation.",
    resourceIds: [2, 4],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Machine Learning Basics",
    description: "Explore fundamental machine learning algorithms and techniques.",
    resourceIds: [3, 8],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Big Data Technologies",
    description: "Learn tools and frameworks for handling large datasets.",
    resourceIds: [1, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Data Science Projects",
    description: "Apply your skills to real-world data science projects and build a portfolio.",
    resourceIds: [6, 7],
    completed: false
  }
];

// Sample roadmap for Machine Learning
const machineLearningRoadmap: RoadmapStep[] = [
  {
    id: uuidv4(),
    title: "Mathematics for Machine Learning",
    description: "Build a strong foundation in linear algebra, calculus, and probability.",
    resourceIds: [1, 3],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Python for Machine Learning",
    description: "Learn Python and essential libraries like NumPy and SciPy.",
    resourceIds: [2, 4],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Supervised Learning Algorithms",
    description: "Master regression, classification, and ensemble techniques.",
    resourceIds: [5, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Unsupervised Learning",
    description: "Explore clustering, dimensionality reduction, and association analysis.",
    resourceIds: [6, 8],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Neural Networks & Deep Learning",
    description: "Learn the fundamentals of neural networks and deep learning architectures.",
    resourceIds: [1, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Computer Vision",
    description: "Understand techniques for image recognition and processing.",
    resourceIds: [2, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Natural Language Processing",
    description: "Master techniques for working with text data and language models.",
    resourceIds: [3, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "ML Operations & Deployment",
    description: "Learn how to deploy and maintain machine learning models in production.",
    resourceIds: [4, 8],
    completed: false
  }
];

// Sample roadmap for Mobile Development
const mobileDevelopmentRoadmap: RoadmapStep[] = [
  {
    id: uuidv4(),
    title: "Mobile Development Fundamentals",
    description: "Understand the basics of mobile app development and platforms.",
    resourceIds: [1, 2],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Swift & iOS Development",
    description: "Learn Swift programming language and iOS app development.",
    resourceIds: [3, 4],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Kotlin & Android Development",
    description: "Master Kotlin and Android Studio for building Android apps.",
    resourceIds: [5, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Cross-Platform Development with Flutter",
    description: "Learn to build apps for multiple platforms using Flutter and Dart.",
    resourceIds: [7, 8],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Mobile UI/UX Design",
    description: "Master the principles of designing intuitive mobile interfaces.",
    resourceIds: [1, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Mobile Backend Services",
    description: "Understand how to integrate with backend services and APIs.",
    resourceIds: [2, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Local Data Storage",
    description: "Learn techniques for storing and managing data on mobile devices.",
    resourceIds: [3, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "App Deployment & Publishing",
    description: "Learn how to prepare, test, and publish your app to app stores.",
    resourceIds: [4, 8],
    completed: false
  }
];

// Sample roadmap for Blockchain
const blockchainRoadmap: RoadmapStep[] = [
  {
    id: uuidv4(),
    title: "Blockchain Fundamentals",
    description: "Understand the basic concepts and principles of blockchain technology.",
    resourceIds: [1, 2],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Cryptography Basics",
    description: "Learn essential cryptographic concepts that power blockchain security.",
    resourceIds: [3, 4],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Bitcoin Protocol",
    description: "Understand how Bitcoin works as the first blockchain implementation.",
    resourceIds: [5, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Ethereum & Smart Contracts",
    description: "Learn about Ethereum and how to write smart contracts with Solidity.",
    resourceIds: [7, 8],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Decentralized Applications (DApps)",
    description: "Build applications that run on decentralized blockchain networks.",
    resourceIds: [1, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Web3 Development",
    description: "Learn to create web applications that interact with blockchain networks.",
    resourceIds: [2, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Tokenomics & NFTs",
    description: "Understand token economics, cryptocurrency, and non-fungible tokens.",
    resourceIds: [3, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Blockchain Security & Best Practices",
    description: "Master security considerations and best practices for blockchain development.",
    resourceIds: [4, 8],
    completed: false
  }
];

// Sample roadmap for Cloud Computing
const cloudComputingRoadmap: RoadmapStep[] = [
  {
    id: uuidv4(),
    title: "Cloud Computing Fundamentals",
    description: "Understand the basics of cloud services, models, and providers.",
    resourceIds: [1, 2],
    completed: false
  },
  {
    id: uuidv4(),
    title: "AWS Essentials",
    description: "Learn the fundamental services and architecture of Amazon Web Services.",
    resourceIds: [3, 4],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Microsoft Azure Basics",
    description: "Explore Microsoft's cloud platform and its core services.",
    resourceIds: [5, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Google Cloud Platform",
    description: "Learn about Google's cloud infrastructure and services.",
    resourceIds: [7, 8],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Cloud Storage & Databases",
    description: "Master various storage solutions and database services in the cloud.",
    resourceIds: [1, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Serverless Computing",
    description: "Understand serverless architecture and Function as a Service (FaaS).",
    resourceIds: [2, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Cloud Security",
    description: "Learn security best practices and compliance in cloud environments.",
    resourceIds: [3, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Cloud Cost Optimization",
    description: "Master strategies for managing and optimizing cloud costs.",
    resourceIds: [4, 8],
    completed: false
  }
];

// Sample roadmap for DevOps
const devopsRoadmap: RoadmapStep[] = [
  {
    id: uuidv4(),
    title: "DevOps Fundamentals",
    description: "Understand the DevOps culture, principles, and practices.",
    resourceIds: [1, 2],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Linux & Scripting",
    description: "Learn Linux administration and shell scripting fundamentals.",
    resourceIds: [3, 4],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Version Control with Git",
    description: "Master Git for source code management and collaboration.",
    resourceIds: [5, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Containerization with Docker",
    description: "Learn how to containerize applications using Docker.",
    resourceIds: [7, 8],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Container Orchestration with Kubernetes",
    description: "Master deploying and managing containers at scale with Kubernetes.",
    resourceIds: [1, 5],
    completed: false
  },
  {
    id: uuidv4(),
    title: "CI/CD Pipelines",
    description: "Set up continuous integration and continuous deployment pipelines.",
    resourceIds: [2, 6],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Infrastructure as Code",
    description: "Learn tools like Terraform and CloudFormation for infrastructure automation.",
    resourceIds: [3, 7],
    completed: false
  },
  {
    id: uuidv4(),
    title: "Monitoring & Observability",
    description: "Implement systems for monitoring, logging, and observability.",
    resourceIds: [4, 8],
    completed: false
  }
];
