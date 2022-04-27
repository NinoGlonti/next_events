import { MongoClient} from 'mongodb'

async function connectDatabase() {
    const client = await MongoClient.connect('mongodb+srv://Nitsa:Twat1234@cluster0.i1saj.mongodb.net/events?retryWrites=true&w=majority')
    return client
}

async function insertDocument(client, document) {
    const db = client.db() 
    await db.collection('emails').insertOne(document)
}
async function handler(req, res) {
    if(req.method === 'POST') {
        const userEmail = req.body.email;

        if(!userEmail || !userEmail.includes('@')) {
            res.status(422).json({ message: 'Invalid email adress. '});
            return;
        }
        
        let client;
        try {
            client = await connectDatabase();
        } catch (error) {
          res.status(500).json({ message: 'Connecting to database failed!'})
          return;
        }

        try {
          await insertDocument(client, {email: userEmail})
          client.close()
        } catch (error) {
          res.status(500).json({ message: 'Inserting data failed'})
          return;
        }

        client.close()
        res.status(201).json({ message: 'Signed Up!'})

    }
}

export default handler;