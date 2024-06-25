const batchSchema = new mongoose.Schema({
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    students: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Student' 
    }]
  });
  
  const Batch = mongoose.model('Batch', batchSchema);