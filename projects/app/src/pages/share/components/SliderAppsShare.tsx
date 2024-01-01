import React from 'react';
import { Flex, Box, IconButton } from '@chakra-ui/react';
import Avatar from '@/components/Avatar';

const SliderAppsShare = ({ apps }: { apps: any[] }) => {
  return (
    <Flex flexDirection={'column'} h={'100%'}>
      <Box px={5} py={4}>
        <Flex
          alignItems={'center'}
          cursor={'pointer'}
          py={2}
          px={3}
          borderRadius={'md'}
          _hover={{ bg: 'myGray.200' }}
        >
          <h1>Your Company Logo</h1>
        </Flex>
      </Box>
      <Box flex={'1 0 0'} h={0} px={5} overflow={'overlay'}>
        {apps.map((item) => (
          <Flex
            /*key={item._id}*/
            py={2}
            px={3}
            mb={3}
            cursor={'pointer'}
            backgroundColor={'#ffffff'}
            borderRadius={'lg'}
            alignItems={'center'}
            onClick={() => {
              window.location = 'http://localhost:3000/share/share?shareId=' + item.share;
            }}
          >
            <Avatar src={item.avatar} w={'24px'} />
            <Box ml={2} className={'textEllipsis'}>
              {item.name}
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};

export default SliderAppsShare;
