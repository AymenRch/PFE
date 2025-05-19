export const projects = [
  {
    id: 1,
    title: "GreenTech Solutions",
    description: "Sustainable energy solutions for small businesses. Seeking $50,000 for expansion.",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Algiers",
    price: "$50,000",
    equity: "15%",
    industry: "Clean Energy",
    stage: "Early Growth",
    businessModel: "Subscription"
  },
  {
    id: 2,
    title: "Urban Farm Co.",
    description: "Vertical farming startup providing fresh produce to local restaurants. Looking for $30,000 to scale operations.",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Oran",
    price: "$30,000",
    equity: "20%",
    industry: "Agriculture",
    stage: "Seed Stage",
    businessModel: "One-time"
  },
  {
    id: 3,
    title: "TechTutor",
    description: "Online platform connecting students with tech tutors. Seeking $25,000 for platform development.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Constantine",
    price: "$25,000",
    equity: "10%",
    industry: "Education",
    stage: "Pre-Seed",
    businessModel: "Project-based"
  },
  {
    id: 4,
    title: "EcoPack",
    description: "Sustainable packaging solutions for e-commerce. Looking for $40,000 to expand production.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Annaba",
    price: "$40,000",
    equity: "12%",
    industry: "Manufacturing",
    stage: "Early Growth",
    businessModel: "Hybrid"
  },
  {
    id: 5,
    title: "HealthTrack",
    description: "AI-powered health monitoring app for seniors. Seeking $35,000 for development and testing.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    location: "Tizi Ouzou",
    price: "$35,000",
    equity: "18%",
    industry: "Healthcare",
    stage: "Seed Stage",
    businessModel: "Subscription"
  }
];

export const recentActivities = [
  {
    id: 1,
    activity: "New investment opportunity added",
    time: "10 minutes ago",
    user: "Sarah Johnson"
  },
  {
    id: 2,
    activity: "Investment proposal reviewed",
    time: "25 minutes ago",
    user: "Michael Brown"
  },
  {
    id: 3,
    activity: "Due diligence completed",
    time: "1 hour ago",
    user: "Emily Davis"
  },
  {
    id: 4,
    activity: "Investment meeting scheduled",
    time: "3 hours ago",
    user: "David Wilson"
  },
  {
    id: 5,
    activity: "New investor onboarded",
    time: "5 hours ago",
    user: "Jennifer Taylor"
  }
];

export const weeklyCheckIns = {
  labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      data: [150, 230, 280, 320, 180, 250, 290],
      backgroundColor: [
        '#9BB8ED', // Sunday
        '#6DE7B4', // Monday
        '#333333', // Tuesday
        '#7665F1', // Wednesday
        '#9BB8ED', // Thursday
        '#6DE7B4', // Friday
        '#E882D8'  // Saturday
      ],
      borderRadius: 6,
      borderSkipped: false,
    }
  ]
};

export const equipmentUsage = {
  labels: ['Weights', 'Treadmill', 'Cross trainer', 'Other'],
  datasets: [
    {
      data: [42.1, 22.8, 13.9, 21.2],
      backgroundColor: [
        '#7665F1',
        '#9BB8ED',
        '#6DE7B4',
        '#E0E0E0'
      ],
      borderWidth: 0,
    }
  ]
};

export const hourlyBalance = {
  labels: ['06:00AM', '07:00AM', '08:00AM', '09:00AM', '10:00AM', '11:00AM', '12:00PM', '01:00PM', '02:00PM', '03:00PM', '04:00PM', '05:00PM', '06:00PM', '07:00PM'],
  datasets: [
    {
      label: 'Members',
      data: [10, 25, 45, 30, 25, 30, 20, 15, 35, 40, 30, 25, 45, 35],
      fill: true,
      backgroundColor: 'rgba(118, 101, 241, 0.1)',
      borderColor: '#7665F1',
      tension: 0.4,
    }
  ]
};