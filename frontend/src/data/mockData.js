// Mock Database for CampusBuddy / CampusCart
export const CAMPUS_DATA = {
  products: [
    {
      id: 1,
      title: "Lab Notebook",
      category: "Notes & Material",
      stock:5,
      price: 12.99,
      originalPrice: 22.00,
      mode: "BUY",
      condition: "Brand New (Unused)",
      seller: {
        name: "Elena Rostova",
        email: "elena.r@campus.edu",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
        trustScore: 99,
        verified: true,
        department: "Biochemistry, Year 3",
        reviews: 28,
        rating: 4.9
      },
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80",
      description: "Hardbound grid-ruled science laboratory notebook with numbered pages and archival-quality paper. Suitable for chemistry and biology practicals.",
      pickupLocation: "Central Science Library Foyer"
    },
    {
      id: 2,
      title: "Silicone Tech Case",
      category: "Tech & Accessories",
      stock:5,
      price: 17.50,
      originalPrice: 32.00,
      mode: "BUY",
      condition: "Like New (Mint)",
      seller: {
        name: "Marcus Vance",
        email: "m.vance@campus.edu",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
        trustScore: 97,
        verified: true,
        department: "Computer Science, Year 4",
        reviews: 42,
        rating: 4.8
      },
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&auto=format&fit=crop&q=80",
      description: "Deep forest green ribbed protective silicone case with brass carabiner. Impact-resistant drop protection for AirPods and wireless earbuds.",
      pickupLocation: "Student Center Canteen"
    },
    {
      id: 3,
      title: "Academic Graduation Cap",
      category: "Event & Formal",
      stock:5,
      price: 19.99,
      originalPrice: 45.00,
      mode: "RENT",
      rentalRate: "$5.00 / day",
      condition: "Pristine with golden tassel",
      seller: {
        name: "Sophia Chen",
        email: "sophia.c@campus.edu",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
        trustScore: 98,
        verified: true,
        department: "Architecture, Alumna",
        reviews: 19,
        rating: 5.0
      },
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80",
      description: "Royal blue velvet mortarboard cap with ceremonial burgundy-gold tassel. Rent for graduation photoshoot sessions without paying full price.",
      pickupLocation: "Admin Building Porch"
    },
    {
      id: 4,
      title: "Handcrafted Bird Beanie",
      category: "Apparel & Winter",
      stock:5,
      price: 15.00,
      originalPrice: 28.00,
      mode: "BUY",
      condition: "Hand-knitted pure wool",
      seller: {
        name: "Chloe Dubois",
        email: "c.dubois@campus.edu",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&auto=format&fit=crop&q=80",
        trustScore: 96,
        verified: true,
        department: "Fine Arts, Year 2",
        reviews: 15,
        rating: 4.9
      },
      image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=900&auto=format&fit=crop&q=80",
      description: "Artisan teal knit winter beanie with yellow heraldic eagle pattern. Cozy, soft, and crafted locally by campus art club students.",
      pickupLocation: "Fine Arts Courtyard"
    },
    {
      id: 5,
      title: "Student Canvas Backpack",
      category: "Bags & Living",
      stock:5,
      price: 49.99,
      originalPrice: 89.00,
      mode: "BUY",
      condition: "Lightly Used (3 months)",
      seller: {
        name: "Daniel Kim",
        email: "d.kim@campus.edu",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
        trustScore: 98,
        verified: true,
        department: "Mechanical Engg, Year 3",
        reviews: 31,
        rating: 4.9
      },
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=80",
      description: "Heavy-duty ochre canvas campus daypack with 15.6-inch padded laptop sleeve, water bottle holders, and reinforced leather pull tabs.",
      pickupLocation: "Hostel Block 3 Entrance"
    },
    {
      id: 6,
      title: "Stainless Steel Travel Mug",
      category: "Hostel Living",
      stock:5,
      price: 24.99,
      originalPrice: 38.00,
      mode: "EXCHANGE",
      condition: "Excellent (Vacuum seal)",
      exchangeWish: "Willing to trade for Casio FX-991 Calculator or Desk Lamp",
      seller: {
        name: "Arjun Patel",
        email: "arjun.p@campus.edu",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80",
        trustScore: 99,
        verified: true,
        department: "Electrical Engg, Year 4",
        reviews: 54,
        rating: 4.95
      },
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&auto=format&fit=crop&q=80",
      description: "Double-wall insulated brushed stainless steel tumbler (500ml). Keeps coffee piping hot for 12 hours during overnight library cram sessions.",
      pickupLocation: "Nescafe Canteen Bench"
    }
  ],

  services: [
    {
      id: "s1",
      title: "Hands-On Laboratory Research",
      tagline: "Biomedical & Materials Synthesis",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
      description: "Work directly alongside senior fellows on PCR assay workflows, centrifuge operations, and cleanroom lab protocol certifications.",
      instructor: "Dr. L. Al-Mansoor & Senior Fellows"
    },
    {
      id: "s2",
      title: "Relentless Mentorship & Project Fusion",
      tagline: "Capstone & Full-Stack Architecture",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
      description: "Accelerate your portfolio projects with rigorous code reviews, scalable database schema design, and live viva interview drills.",
      instructor: "Alexander Wright, Ex-FAANG Lead"
    },
    {
      id: "s3",
      title: "Performance, Media & Design Studios",
      tagline: "Creative Arts & Stage Craft",
      image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80",
      description: "Master lighting acoustics, spatial design, camera blocking, and modern multimedia storytelling in state-of-the-art campus halls.",
      instructor: "Prof. Madeleine Croft"
    }
  ],

  course: {
    title: "Applied Modern Engineering & Data Systems",
    subtitle: "Write an introduction that summarizes the expected outcomes of this course.",
    heroImage: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1400&auto=format&fit=crop&q=80",
    instructor: {
      name: "Dr. Julian Vance",
      role: "Lead Systems Architect & Visiting Professor",
      bio: "Your instructor has crushed complex data challenges for global enterprises and research labs alike. Now they channel that hard-won expertise into concise lessons, hands-on projects, and battle-tested strategies that fast-track your success.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      backpackImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
    },
    faqs: [
      {
        q: "Do I need prior coding experience before starting?",
        a: "No prior enterprise experience required. We build foundations from ground zero, advancing progressively to distributed architecture."
      },
      {
        q: "Will I get a certificate upon completion?",
        a: "Yes, verified by the University Engineering Department with a verifiable cryptographic hash and credential ID."
      },
      {
        q: "What kind of support can I expect during campus hours?",
        a: "Daily TA office hours at the Engineering block, plus direct 24/7 Discord channel access with senior peer tutors."
      }
    ]
  },

  about: {
    headline: "Transform Learning. Ignite Futures.",
    subheadline: "We unleash real-world power in every classroom.",
    copy: "Our university network crushes the gap between theory and execution. Industry-seasoned professors deliver immersive, project-driven programs. Students exit with market-ready mastery in record time.",
    capImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80"
  },

  contact: {
    headline: "Ready to Transform Your Future? Act Now.",
    subheadline: "Complete the form below—our advisors respond fast; let's build your breakthrough together.",
    deskImage: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1000&auto=format&fit=crop&q=80"
  }
};

if (typeof window !== 'undefined') { window.CAMPUS_DATA = CAMPUS_DATA; }
export default CAMPUS_DATA;
