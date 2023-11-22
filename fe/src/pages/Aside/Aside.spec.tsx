import { screen } from '@testing-library/react';
import render from '../../test-utils/test-utils';
import { Aside } from './Aside';

const mockUsers = [
  {
    name: 'Lorem Ipsum',
    id: '1',
    pic: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
  },
  {
    name: 'Vasia Loh',
    id: '2',
    pic: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png',
  },
];

// describe('Aside', () => {
//   it('Should render correctly', () => {
//     render(<Aside users={mockUsers} />);
//
//     expect(screen.getByText('Lorem Ipsum', { selector: 'p' })).toBeInTheDocument();
//     expect(screen.getByText('Vasia Loh', { selector: 'p' })).toBeInTheDocument();
//   });
// });
