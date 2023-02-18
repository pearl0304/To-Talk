import { ApolloError } from 'apollo-server-express';

export const errorMessages = (code: string) => {
  let message = '';
  switch (code) {
    case '001':
      message = `DON'T MATCH THE PASSWORD`;
      break;
    case '002':
      message = 'DUPLICATED EMAIL';
      break;
    case '003':
      message = 'DUPLICATED DISPLAY NAME';
      break;
    case '004':
      message = `YOU DO NOT HAVE ACCESS`;
      break;
    case '005':
      message = 'NO USER INFO';
      break;
    case '006':
      message = 'NO ARTICLE INFO';
    case '007':
      message = 'NO COMMENT INFO';
  }
  throw new ApolloError(message);
};
