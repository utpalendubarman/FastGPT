import React, { useState } from 'react';
import { Box, useTheme } from '@chakra-ui/react';

import { OutLinkTypeEnum } from '@fastgpt/global/support/outLink/constant';
import dynamic from 'next/dynamic';

import MyRadio from '@/components/common/MyRadio';
import Share from './Share';
const API = dynamic(() => import('./API'));

const OutLink = ({ appId }: { appId: string }) => {
  const theme = useTheme();

  const [linkType, setLinkType] = useState<`${OutLinkTypeEnum}`>(OutLinkTypeEnum.share);

  return (
    <Box pt={[1, 5]}>
      {/* <MyRadio
          gridTemplateColumns={['repeat(1,1fr)', 'repeat(auto-fill, minmax(0, 360px))']}
          iconSize={'20px'}
          list={[
            {
              icon: 'support/outlink/shareLight',
              title: 'No login window',
              desc: 'Share the link with other users and use it directly without logging in',
              value: OutLinkTypeEnum.share
            },
            // {
            //   icon: 'apikeyFill',
            //   title: 'API access',
            //   desc: 'Connect to existing systems through API, or Qiwei, Feishu, etc.',
            //   value: OutLinkTypeEnum.apikey
            // }
            // {
            //   icon: 'support/outlink/iframeLight',
            //   title: '网页嵌入',
            //   desc: '嵌入到已有网页中，右下角会生成对话按键',
            //   value: OutLinkTypeEnum.iframe
            // }
          ]}
          value={linkType}
          onChange={(e) => setLinkType(e as `${OutLinkTypeEnum}`)}
        /> */}

      {linkType === OutLinkTypeEnum.share && <Share appId={appId} />}
      {linkType === OutLinkTypeEnum.apikey && <API appId={appId} />}
    </Box>
  );
};

export default OutLink;
