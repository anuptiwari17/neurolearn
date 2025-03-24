const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();



const userData = [
  {
    id: 'user1',
    displayName: 'John Smith',
    email: 'john.smith@example.com',
    role: 'teacher',
    createdAt: admin.firestore.Timestamp.now(),
    createdCourses: ['course1', 'course2']
  },
  {
    id: 'user2',
    displayName: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    role: 'student',
    createdAt: admin.firestore.Timestamp.now(),
    enrolledCourses: ['course1']
  },
  {
    id: 'user3',
    displayName: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'student',
    createdAt: admin.firestore.Timestamp.now(),
    enrolledCourses: ['course1', 'course2']
  }
];


const coursesData = [
  {
    id: 'course1',
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science and programming',
    subject: 'Computer Science',
    code: 'CS101',
    teacherId: 'user1',
    teacherName: 'John Smith',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    students: ['user2', 'user3'],
    syllabus: [
      {title: 'Introduction to Programming', completed: true},
      {title: 'Data Structures', completed: false},
      {title: 'Algorithms', completed: false}
    ]
  },
  {
    id: 'course2',
    title: 'Advanced Mathematics',
    description: 'Calculus and Linear Algebra',
    subject: 'Mathematics',
    code: 'MATH201',
    teacherId: 'user1',
    teacherName: 'John Smith',
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
    students: ['user3'],
    syllabus: [
      {title: 'Limits and Continuity', completed: false},
      {title: 'Derivatives', completed: false},
      {title: 'Integration', completed: false}
    ]
  }
];




const announcementsData = {
  'course1': [
    {
      content: 'Welcome to CS101! Check out the syllabus.',
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: 'user1'
    },
    {
      content: 'Office hours will be held on Thursdays from 2-4pm.',
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: 'user1'
    }
  ],
  'course2': [
    {
      content: 'Welcome to Advanced Mathematics! Make sure to review the prerequisites.',
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: 'user1'
    }
  ]
};






const assignmentsData = {
  'course1': [
    {
      id: 'assignment1',
      title: 'Hello World Program',
      description: 'Write your first program in Python',
      dueDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // One week from now
      points: 10,
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      id: 'assignment2',
      title: 'Loops and Conditionals',
      description: 'Practice using loops and conditionals in Python',
      dueDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), // Two weeks from now
      points: 15,
      createdAt: admin.firestore.Timestamp.now()
    }
  ],
  'course2': [
    {
      id: 'assignment1',
      title: 'Limits Problem Set',
      description: 'Solve problems on limits and continuity',
      dueDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)), // Ten days from now
      points: 20,
      createdAt: admin.firestore.Timestamp.now()
    }
  ]
};


const submissionsData = {
  'course1': {
    'assignment1': [
      {
        studentId: 'user2',
        studentName: 'Emma Wilson',
        submissionDate: admin.firestore.Timestamp.now(),
        fileUrl: 'https://storage.example.com/submissions/emma-hw1.pdf',
        grade: null,
        feedback: null
      }
    ]
  }
};


const notesData = {
  'course1': [
    {
      title: 'Python Basics',
      description: 'Introduction to Python syntax',
      fileUrl: 'https://storage.example.com/notes/python-basics.pdf',
      createdAt: admin.firestore.Timestamp.now()
    },
    {
      title: 'Variables and Data Types',
      description: 'Understanding variables and data types in Python',
      fileUrl: 'https://storage.example.com/notes/python-variables.pdf',
      createdAt: admin.firestore.Timestamp.now()
    }
  ],
  'course2': [
    {
      title: 'Introduction to Calculus',
      description: 'Basic concepts of limits and derivatives',
      fileUrl: 'https://storage.example.com/notes/intro-calculus.pdf',
      createdAt: admin.firestore.Timestamp.now()
    }
  ]
};




const discussionsData = {
  'course1': [
    {
      title: 'Questions about assignment',
      content: 'I\'m having trouble with the loops section',
      createdBy: 'user2',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    }
  ],
  'course2': [
    {
      title: 'Study group for midterm',
      content: 'Would anyone be interested in forming a study group?',
      createdBy: 'user3',
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    }
  ]
};



const messagesData = [
  {
    senderId: 'user2', // Emma
    senderName: 'Emma Wilson',
    recipientId: 'user1', // John (teacher)
    content: 'Hi Professor, I have a question about the assignment',
    timestamp: admin.firestore.Timestamp.now(),
    read: false,
    courseId: 'course1'
  },
  {
    senderId: 'user1', // John (teacher)
    senderName: 'John Smith',
    recipientId: 'user2', // Emma
    content: 'Sure, what\'s your question?',
    timestamp: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 60 * 1000)), // 30 minutes later
    read: false,
    courseId: 'course1'
  }
];



// Data seeding functions --


async function seedUsers() {
  console.log('Seeding users...');
  const batch = db.batch();
  
  for (const user of userData) {
    const { id, ...userData } = user;
    const userRef = db.collection('users').doc(id);
    batch.set(userRef, userData);
  }
  
  await batch.commit();
  console.log('Users seeded successfully!');
}

async function seedCourses() {
  console.log('Seeding courses...');
  const batch = db.batch();
  
  for (const course of coursesData) {
    const { id, ...courseData } = course;
    const courseRef = db.collection('courses').doc(id);
    batch.set(courseRef, courseData);
  }
  
  await batch.commit();
  console.log('Courses seeded successfully!');
}

async function seedAnnouncements() {
  console.log('Seeding announcements...');
  
  for (const [courseId, announcements] of Object.entries(announcementsData)) {
    const batch = db.batch();
    
    for (const announcement of announcements) {
      const announcementRef = db.collection('courses').doc(courseId)
                               .collection('announcements').doc();
      batch.set(announcementRef, announcement);
    }
    
    await batch.commit();
  }
  
  console.log('Announcements seeded successfully!');
}

async function seedAssignments() {
  console.log('Seeding assignments...');
  
  for (const [courseId, assignments] of Object.entries(assignmentsData)) {
    const batch = db.batch();
    
    for (const assignment of assignments) {
      const { id, ...assignmentData } = assignment;
      const assignmentRef = db.collection('courses').doc(courseId)
                             .collection('assignments').doc(id);
      batch.set(assignmentRef, assignmentData);
    }
    
    await batch.commit();
  }
  
  console.log('Assignments seeded successfully!');
}

async function seedSubmissions() {
  console.log('Seeding submissions...');
  
  for (const [courseId, assignmentSubmissions] of Object.entries(submissionsData)) {
    for (const [assignmentId, submissions] of Object.entries(assignmentSubmissions)) {
      const batch = db.batch();
      
      for (const submission of submissions) {
        const submissionRef = db.collection('courses').doc(courseId)
                               .collection('assignments').doc(assignmentId)
                               .collection('submissions').doc();
        batch.set(submissionRef, submission);
      }
      
      await batch.commit();
    }
  }
  
  console.log('Submissions seeded successfully!');
}

async function seedNotes() {
  console.log('Seeding notes...');
  
  for (const [courseId, notes] of Object.entries(notesData)) {
    const batch = db.batch();
    
    for (const note of notes) {
      const noteRef = db.collection('courses').doc(courseId)
                       .collection('notes').doc();
      batch.set(noteRef, note);
    }
    
    await batch.commit();
  }
  
  console.log('Notes seeded successfully!');
}

async function seedDiscussions() {
  console.log('Seeding discussions...');
  
  for (const [courseId, discussions] of Object.entries(discussionsData)) {
    const batch = db.batch();
    
    for (const discussion of discussions) {
      const discussionRef = db.collection('courses').doc(courseId)
                             .collection('discussions').doc();
      batch.set(discussionRef, discussion);
    }
    
    await batch.commit();
  }
  
  console.log('Discussions seeded successfully!');
}

async function seedMessages() {
  console.log('Seeding messages...');
  const batch = db.batch();
  
  for (const message of messagesData) {
    const messageRef = db.collection('messages').doc();
    batch.set(messageRef, message);
  }
  
  await batch.commit();
  console.log('Messages seeded successfully!');
}


//Optional: Function to clear existing data --


async function clearCollections() {
  console.log('Clearing existing data...');
  

  // This is my helper function to delete a collection
  async function deleteCollection(collectionPath) {
    const collectionRef = db.collection(collectionPath);
    const snapshot = await collectionRef.get();
    
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleared collection: ${collectionPath}`);
  }
  
  // This is to delete main collections
  await deleteCollection('users');
  await deleteCollection('messages');
  
  // Get all courses to delete subcollections
  const coursesSnapshot = await db.collection('courses').get();
  
  for (const courseDoc of coursesSnapshot.docs) {
    const courseId = courseDoc.id;
    
    // Delete all subcollections
    await deleteCollection(`courses/${courseId}/announcements`);
    await deleteCollection(`courses/${courseId}/notes`);
    await deleteCollection(`courses/${courseId}/discussions`);
    
    // Get assignments to delete submissions
    const assignmentsSnapshot = await db.collection(`courses/${courseId}/assignments`).get();
    
    for (const assignmentDoc of assignmentsSnapshot.docs) {
      const assignmentId = assignmentDoc.id;
      await deleteCollection(`courses/${courseId}/assignments/${assignmentId}/submissions`);
    }
    
    await deleteCollection(`courses/${courseId}/assignments`);
  }
  
  await deleteCollection('courses');
  
  console.log('All collections cleared successfully!');
}

// 6. Main function to execute seeding
async function seedAll() {
  try {
    // Uncomment if you want to clear data first
    // await clearCollections();
    
    await seedUsers();
    await seedCourses();
    await seedAnnouncements();
    await seedAssignments();
    await seedSubmissions();
    await seedNotes();
    await seedDiscussions();
    await seedMessages();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    process.exit(0);
  }
}


// To Run the seeding process
seedAll();