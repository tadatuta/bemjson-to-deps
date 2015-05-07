module.exports = [
    {
        block: 'b1',
        elems: [
            {
                elem: 'e1',
                mods: { m1: 'v1', bool: true }
            },
            'e2',
            'e3'
        ],
        mods: {
            b1m1: ['v1', 'v2']
        }
    },
    'b3',
    {
        block: 'b2',
        elems: [
            'e1Ofb2',
            'e2Ofb2'
        ]
    }
]
