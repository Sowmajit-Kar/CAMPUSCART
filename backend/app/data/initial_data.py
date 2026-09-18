# Initial Seed Data for CampusCart MongoDB Collection

INITIAL_PRODUCTS = [
    {
        "title": "Robbins Pathologic Basis of Disease (10th Edition)",
        "category": "Medical Books",
        "stream": "medical",
        "price": 850.0,
        "originalPrice": 2400.0,
        "mode": "BUY",
        "condition": "Like New (Clean pages, no highlighters)",
        "stock": 1,
        "status": "available",
        "campus": "Calcutta Medical College",
        "pickupLocation": "College Council Hall Portico",
        "image": "https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=900&auto=format&fit=crop&q=80",
        "description": "Essential gold standard pathology textbook for MBBS 2nd Prof. Hardbound, crisp condition, passed down from senior batch topper.",
        "seller": {
            "name": "Dr. Subham Mukherjee",
            "email": "subham.m@cmc.edu.in",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
            "trustScore": 99,
            "verified": True,
            "department": "MBBS Intern, Calcutta Medical College"
        }
    },
    {
        "title": "Complete Human Osteology Bone Set (MBBS 1st Year)",
        "category": "Medical Gear",
        "stream": "medical",
        "price": 2800.0,
        "originalPrice": 6500.0,
        "mode": "BUY",
        "condition": "Complete anatomical set in padded velvet wooden case",
        "stock": 1,
        "status": "available",
        "campus": "IPGMER / SSKM Hospital",
        "pickupLocation": "Ronald Ross Block Foyer",
        "image": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=900&auto=format&fit=crop&q=80",
        "description": "Original medical study bone set including skull, vertebrae, and appendicular skeleton. Cleaned, articulated, and ideal for anatomy viva preparations.",
        "seller": {
            "name": "Ananya Roy",
            "email": "ananya.r@sskm.wb.gov.in",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80",
            "trustScore": 98,
            "verified": True,
            "department": "MBBS 2nd Prof, IPGMER"
        }
    },
    {
        "title": "Omega Deluxe Engineering Mini Drafter with Pro Scale",
        "category": "Engineering Tools",
        "stream": "engineering",
        "price": 280.0,
        "originalPrice": 750.0,
        "mode": "BUY",
        "condition": "Smooth brass clamp, zero tilt, with carrying canvas bag",
        "stock": 2,
        "status": "available",
        "campus": "Jadavpur University",
        "pickupLocation": "Subarna Jayanti Bhavan / World View Canteen",
        "image": "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=900&auto=format&fit=crop&q=80",
        "description": "Heavy-duty drafting tool for first-year Engineering Graphics (ED) drawings. Comes with precision stainless steel clamps and scale bars.",
        "seller": {
            "name": "Sourav Mondal",
            "email": "sourav.m@ju.edu.in",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
            "trustScore": 97,
            "verified": True,
            "department": "Mechanical Engineering, Year 3"
        }
    },
    {
        "title": "Casio fx-991EX ClassWiz Non-Programmable Calculator",
        "category": "Tech & Electronics",
        "stream": "engineering",
        "price": 650.0,
        "originalPrice": 1495.0,
        "mode": "BUY",
        "condition": "Excellent (New solar cell and fresh CR2032 battery)",
        "stock": 1,
        "status": "available",
        "campus": "IIT Kharagpur",
        "pickupLocation": "Tech Market (Tech M) Clock Tower",
        "image": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=900&auto=format&fit=crop&q=80",
        "description": "Approved for university semester exams and GATE. High-resolution LCD display with QR code function and matrix calculations.",
        "seller": {
            "name": "Arjun Patel",
            "email": "arjun.p@iitkgp.ac.in",
            "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=160&auto=format&fit=crop&q=80",
            "trustScore": 99,
            "verified": True,
            "department": "Computer Science & Engineering, Final Year"
        }
    },
    {
        "title": "Hardbound Science Practical Lab Notebook (200 Pages)",
        "category": "Notes & Material",
        "stream": "general",
        "price": 90.0,
        "originalPrice": 180.0,
        "mode": "BUY",
        "condition": "Brand New (Unused, wrapped in cellophane)",
        "stock": 5,
        "status": "available",
        "campus": "NIT Durgapur",
        "pickupLocation": "Student Activity Center (SAC)",
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&auto=format&fit=crop&q=80",
        "description": "Archival quality grid-ruled paper with numbered margins for Physics and Chemistry practicals. Pre-printed index tables.",
        "seller": {
            "name": "Elena Rostova",
            "email": "elena.r@nitdgp.ac.in",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
            "trustScore": 99,
            "verified": True,
            "department": "Biotechnology, Year 2"
        }
    },
    {
        "title": "Stainless Steel Surgical Dissection Kit (14 Tools in Pouch)",
        "category": "Medical Gear",
        "stream": "medical",
        "price": 380.0,
        "originalPrice": 850.0,
        "mode": "BUY",
        "condition": "Autoclaved surgical-grade stainless steel with leatherette zipper pouch",
        "stock": 1,
        "status": "available",
        "campus": "AIIMS Kalyani",
        "pickupLocation": "Academic Block Central Atrium",
        "image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=900&auto=format&fit=crop&q=80",
        "description": "Includes Mayo Hegar needle holder, dissection scalpel handle with extra No. 24 carbon blades, fine tissue forceps, and curved dissecting scissors.",
        "seller": {
            "name": "Rohan Sen",
            "email": "rohan.s@aiimskalyani.edu.in",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80",
            "trustScore": 98,
            "verified": True,
            "department": "MBBS Batch 2023, AIIMS Kalyani"
        }
    }
]
