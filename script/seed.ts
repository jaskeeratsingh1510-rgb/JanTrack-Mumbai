
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../server/db';
import { CandidateModel } from '../server/models';

// Manually copy the mock data here since we can't easily import from client to server script 
// without complex build config or duplicate files in this setup.
// Alternatively, I'll read the file but direct copy is safer for a script.
// Wait, I can try to import if tsx handles it, but client/src might have non-node compatible imports (like images?)
// Let's paste the data for safety and reliability in this one-off script.

const generateMockPromises = (idPrefix: string) => [
    {
        id: `${idPrefix}-p1`,
        title: "Water Supply Improvement",
        description: "Ensure 24/7 water supply to all societies.",
        status: 'in-progress' as const,
        category: "Utilities",
        completionPercentage: 45
    },
    {
        id: `${idPrefix}-p2`,
        title: "Park Maintenance",
        description: "Regular cleaning and landscaping of local parks.",
        status: 'completed' as const,
        category: "Environment",
        completionPercentage: 100
    }
];

const MOCK_CANDIDATES = [
    {
        id: "1",
        name: "Forum Jiten Parmar",
        party: "Shiv Sena(UBT)",
        constituency: "Mumbai South",
        ward: "Ward 1",
        age: 48,
        education: "BMM",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹12.5 Cr",
        attendance: 88,
        bio: "Focusing on Mumbai's coastal road projects and local train infrastructure.",
        promises: generateMockPromises("1"),
        funds: { allocated: 150000000, utilized: 110000000, projects: [] }
    },
    {
        id: "2",
        name: "Priya Sawant",
        party: "Shiv Sena (UBT)",
        constituency: "Mumbai North West",
        ward: "Ward 2",
        age: 42,
        education: "LL.M., Government Law College",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
        criminalCases: 1,
        assets: "₹4.2 Cr",
        attendance: 95,
        bio: "Advocating for the protection of Aarey Forest.",
        promises: generateMockPromises("2"),
        funds: { allocated: 120000000, utilized: 45000000, projects: [] }
    },
    {
        id: "3",
        name: "Suresh Prabhu",
        party: "BJP",
        constituency: "Mumbai North East",
        ward: "Ward 3",
        age: 55,
        education: "B.E. Civil Engineering",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
        criminalCases: 2,
        assets: "₹28 Cr",
        attendance: 72,
        bio: "Veteran politician focused on industrial growth.",
        promises: generateMockPromises("3"),
        funds: { allocated: 200000000, utilized: 95000000, projects: [] }
    },
    {
        id: "3-alt",
        name: "Karan Johar",
        party: "INC",
        constituency: "Mumbai North East",
        ward: "Ward 3",
        age: 44,
        education: "Graduate",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹8 Cr",
        attendance: 82,
        bio: "Promising fresh perspective and youth-centric policies for Ward 3.",
        promises: generateMockPromises("3-alt"),
        funds: { allocated: 150000000, utilized: 40000000, projects: [] }
    },
    {
        id: "4",
        name: "Rahul Deshmukh",
        party: "MNS",
        constituency: "Dadar",
        ward: "Ward 4",
        age: 39,
        education: "Graduate",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹1.5 Cr",
        attendance: 90,
        bio: "Focused on local Marathi culture and employment.",
        promises: generateMockPromises("4"),
        funds: { allocated: 50000000, utilized: 30000000, projects: [] }
    },
    {
        id: "4-alt",
        name: "Sanjay Raut",
        party: "Shiv Sena (UBT)",
        constituency: "Dadar",
        ward: "Ward 4",
        age: 58,
        education: "Graduate",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=256",
        criminalCases: 5,
        assets: "₹12 Cr",
        attendance: 60,
        bio: "Strong grassroots leader with deep roots in Dadar's political history.",
        promises: generateMockPromises("4-alt"),
        funds: { allocated: 120000000, utilized: 80000000, projects: [] }
    },
    {
        id: "5",
        name: "Anjali Kulkarni",
        party: "INC",
        constituency: "Colaba",
        ward: "Ward 5",
        age: 45,
        education: "Post Graduate",
        image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹5 Cr",
        attendance: 85,
        bio: "Committed to women's safety and education.",
        promises: generateMockPromises("5"),
        funds: { allocated: 80000000, utilized: 60000000, projects: [] }
    },
    {
        id: "6",
        name: "Vikram Jadhav",
        party: "NCP",
        constituency: "Bandra",
        ward: "Ward 6",
        age: 50,
        education: "Graduate",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256",
        criminalCases: 1,
        assets: "₹10 Cr",
        attendance: 80,
        bio: "Promoting sustainable urban development.",
        promises: generateMockPromises("6"),
        funds: { allocated: 120000000, utilized: 80000000, projects: [] }
    },
    {
        id: "7",
        name: "Sunita More",
        party: "Independent",
        constituency: "Andheri",
        ward: "Ward 7",
        age: 41,
        education: "Social Worker",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹80 Lakh",
        attendance: 98,
        bio: "Grassroots worker focusing on slum sanitation.",
        promises: generateMockPromises("7"),
        funds: { allocated: 30000000, utilized: 28000000, projects: [] }
    },
    {
        id: "8",
        name: "Sameer Sheikh",
        party: "AAP",
        constituency: "Kurla",
        ward: "Ward 8",
        age: 35,
        education: "Engineer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹1.2 Cr",
        attendance: 92,
        bio: "Fighting for better school infrastructure and clinics.",
        promises: generateMockPromises("8"),
        funds: { allocated: 60000000, utilized: 40000000, projects: [] }
    },
    {
        id: "9",
        name: "Rohan Patil",
        party: "BJP",
        constituency: "Borivali",
        ward: "Ward 9",
        age: 52,
        education: "Lawyer",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹15 Cr",
        attendance: 75,
        bio: "Focused on infrastructure and connectivity.",
        promises: generateMockPromises("9"),
        funds: { allocated: 180000000, utilized: 120000000, projects: [] }
    },
    {
        id: "10",
        name: "Meera Nair",
        party: "SS (UBT)",
        constituency: "Chembur",
        ward: "Ward 10",
        age: 46,
        education: "Doctor",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹6 Cr",
        attendance: 88,
        bio: "Improving public health facilities in eastern suburbs.",
        promises: generateMockPromises("10"),
        funds: { allocated: 90000000, utilized: 70000000, projects: [] }
    },
    {
        id: "11",
        name: "Ganesh Tawde",
        party: "NCP (AP)",
        constituency: "Worli",
        ward: "Ward 11",
        age: 49,
        education: "Post Graduate",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=256",
        criminalCases: 2,
        assets: "₹20 Cr",
        attendance: 65,
        bio: "Urban planning and development expert.",
        promises: generateMockPromises("11"),
        funds: { allocated: 250000000, utilized: 150000000, projects: [] }
    },
    {
        id: "12",
        name: "Kavita Shah",
        party: "Independent",
        constituency: "Ghatkopar",
        ward: "Ward 12",
        age: 38,
        education: "Social Activist",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹50 Lakh",
        attendance: 99,
        bio: "Independent voice for local community issues.",
        promises: generateMockPromises("12"),
        funds: { allocated: 20000000, utilized: 18000000, projects: [] }
    },
    {
        id: "13",
        name: "Kavita Shah",
        party: "Independent",
        constituency: "Ghatkopar",
        ward: "Ward 12",
        age: 38,
        education: "Social Activist",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=256",
        criminalCases: 0,
        assets: "₹50 Lakh",
        attendance: 99,
        bio: "Independent voice for local community issues.",
        promises: generateMockPromises("12"),
        funds: { allocated: 20000000, utilized: 18000000, projects: [] }
    }
];

async function seed() {
    await connectDB();

    try {
        // Clear existing data
        await CandidateModel.deleteMany({});
        console.log('Cleared existing candidates');

        // Insert new data
        await CandidateModel.insertMany(MOCK_CANDIDATES);
        console.log(`Seeded ${MOCK_CANDIDATES.length} candidates`);

        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seed();
