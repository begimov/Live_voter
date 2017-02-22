import {
    List,
    Map
} from 'immutable';
import {
    expect
} from 'chai';

import {
    setEntries,
    next,
    vote
} from '../src/core';

describe('app logic', () => {

    describe('setEntries', () => {

        it('adds entries to state', () => {
            const state = Map();
            const entries = List.of('Title 1', 'Title 2');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Title 1', 'Title 2')
            }));
        });

        it('transforms to immutable', () => {
            const state = Map();
            const entries = ['Title 1', 'Title 2'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Title 1', 'Title 2')
            }));
        });


    });

    describe('next', () => {
        it('gets two next entries for a vote', () => {
            const state = Map({
                entries: List.of('Title 1', 'Title 2', 'Title 3')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Title 1', 'Title 2')
                }),
                entries: List.of('Title 3')
            }));
        });

        it('puts winner of current vote at the end of list of entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Title 1', 'Title 2'),
                    tally: Map({
                        'Title 1': 4,
                        'Title 2': 2
                    })
                }),
                entries: List.of('Title 3', 'Title 4', 'Title 5')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Title 3', 'Title 4')
                }),
                entries: List.of('Title 5', 'Title 1')
            }));
        });

        it('in case of a tie puts two entries at the end of list', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 3,
                        '28 Days Later': 3
                    })
                }),
                entries: List.of('Sunshine', 'Millions', '127 Hours')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Sunshine', 'Millions')
                }),
                entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
            }));
        });

        it('when single entry remains, marks it as the winner', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List()
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                winner: 'Trainspotting'
            }));
        });
    });

    describe('vote', () => {

        it('creates a result of voting for selected entry', () => {
            const state = Map({
                pair: List.of('Trainspotting', '28 Days Later')
            });
            const nextState = vote(state, 'Trainspotting')
            expect(nextState).to.equal(Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 1
                })
            }));
        });

        it('adds voting point to existing results for selected entry', () => {
            const state = Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 3,
                    '28 Days Later': 2
                })
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(Map({
                pair: List.of('Trainspotting', '28 Days Later'),
                tally: Map({
                    'Trainspotting': 4,
                    '28 Days Later': 2
                })
            }));
        });
    });
});
