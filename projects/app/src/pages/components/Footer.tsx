import React, { useMemo } from 'react';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { feConfigs } from '@/web/common/system/staticData';
import { useTranslation } from 'next-i18next';
import Avatar from '@/components/Avatar';
import { useRouter } from 'next/router';
import CommunityModal from '@/components/CommunityModal';
import { getDocPath } from '@/web/common/system/doc';
import Image from 'next/image';

const Footer = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const list = useMemo(
    () => [
      {
        label: t('home.Footer Product'),
        child: [
          {
            label: t('home.Footer FastGPT Cloud', { title: feConfigs.systemTitle }),
            onClick: () => {
              router.push('/app/list');
            }
          },
          {
            label: 'Sealos',
            onClick: () => {
              window.open('https://github.com/labring/sealos', '_blank');
            }
          },
          {
            label: 'Laf',
            onClick: () => {
              window.open('https://github.com/labring/laf', '_blank');
            }
          }
        ]
      },
      {
        label: t('home.Footer Developer'),
        child: [
          {
            label: t('home.Footer Git'),
            onClick: () => {
              window.open('https://github.com/labring/FastGPT', '_blank');
            }
          },
          {
            label: t('home.Footer Docs'),
            onClick: () => {
              window.open(getDocPath('/docs/intro'), '_blank');
            }
          }
        ]
      },
      {
        label: t('home.Footer Support'),
        child: [
          {
            label: t('home.Footer Feedback'),
            onClick: () => {
              window.open('https://github.com/labring/FastGPT/issues', '_blank');
            }
          },
          {
            label: t('home.Community'),
            onClick: () => {
              onOpen();
            }
          }
        ]
      }
    ],
    [onOpen, router, t]
  );

  return (
    <Box
      display={['block', 'flex']}
      px={[5, 0]}
      maxW={'1200px'}
      m={'auto'}
      py={['30px', '20px']}
      flexWrap={'wrap'}
    >
      <Box flex={1}>
        <Flex alignItems={'center'}>
          <Image width={150} height={30} src="/imgs/home/logo-dark.png" />
        </Flex>
      </Box>
      <Box flex={1} w={'400px'} mt={[2, 0]}>
        <Box color={'myGray.500'} textAlign={'right'}>
          &copy; Copyrights reserved. Tellselling
        </Box>
      </Box>
      {isOpen && <CommunityModal onClose={onClose} />}
    </Box>
  );
};

export default Footer;
