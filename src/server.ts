import AddressManager from './AddressManager';
import PostCodeManager from './PostCodeManager';
import express from 'express';
import cors from 'cors';

const Address = new AddressManager();
const PostCode = new PostCodeManager();
const app = express();
app.use(cors());

app.get('/address', (_, res) => {
    res.json({ prefectures: Address.GetPrefectures() });
});

app.get('/address/:prefecture', (req, res) => {
    const Result = Address.GetCities(req.params.prefecture);
    if (Result == null) res.sendStatus(404);
    else res.json({ cities: Result });
});

app.get('/address/:prefecture/:city', (req, res) => {
    const Result = Address.GetAddresses(req.params.prefecture, req.params.city);
    if (Result == null) res.sendStatus(404);
    else res.json({ addresses: Result });
});

app.get('/postcode/:postcode', (req, res) => {
    const PostCodeInformation = PostCode.GetPostCodeInformation(req.params.postcode);
    if (PostCodeInformation == null) res.sendStatus(404);
    else res.json(PostCodeInformation);
});

app.use(express.static('wwwroot'));

export default app;
