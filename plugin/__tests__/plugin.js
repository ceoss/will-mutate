import path from 'path';
import { create } from 'babel-test';

const { fixtures } = create({
    plugins: [require.resolve('..')],
});

fixtures('my plugin', path.join(__dirname, '__fixtures__'));
