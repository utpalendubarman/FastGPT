import React, { useMemo, useState } from 'react';
import { Box, type BoxProps, Flex, useTheme, ModalCloseButton } from '@chakra-ui/react';
import MyRadio from '@/components/common/MyRadio/index';
import dynamic from 'next/dynamic';
import ChunkImport from './WebChunk';
import { useTranslation } from 'next-i18next';

const QAImport = dynamic(() => import('./QA'), {});
const CsvImport = dynamic(() => import('./Csv'), {});
import MyModal from '@/components/MyModal';
import Provider from './Provider';
import { useDatasetStore } from '@/web/core/dataset/store/dataset';
import {
  DatasetCollectionTrainingModeEnum,
  TrainingModeEnum
} from '@fastgpt/global/core/dataset/constant';

export enum ImportTypeEnum {
  chunk = 'chunk',
  qa = 'qa',
  csv = 'csv'
}

const ImportWebData = ({
  datasetId,
  parentId,
  onClose,
  uploadSuccess
}: {
  datasetId: string;
  parentId: string;
  onClose: () => void;
  uploadSuccess: () => void;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { datasetDetail } = useDatasetStore();
  const [importType, setImportType] = useState<`${ImportTypeEnum}`>(ImportTypeEnum.chunk);
  const vectorModel = datasetDetail.vectorModel;
  const agentModel = datasetDetail.agentModel;

  const typeMap = useMemo(() => {
    const map = {
      [ImportTypeEnum.chunk]: {
        defaultChunkLen: vectorModel?.defaultToken || 500,
        chunkOverlapRatio: 0.2,
        unitPrice: vectorModel?.price || 0.2,
        mode: TrainingModeEnum.chunk,
        collectionTrainingType: DatasetCollectionTrainingModeEnum.chunk
      }
    };
    return map[importType];
  }, [
    agentModel?.maxContext,
    agentModel?.price,
    importType,
    vectorModel?.defaultToken,
    vectorModel?.price
  ]);

  const TitleStyle: BoxProps = {
    fontWeight: 'bold',
    fontSize: ['md', 'xl']
  };

  return (
    <MyModal
      iconSrc="/imgs/modal/import.svg"
      title={<Box {...TitleStyle}>Import Website Data</Box>}
      isOpen
      isCentered
      maxW={['42vw', 'min(400px,42vw)']}
      w={['42vw', 'min(400px,42vw)']}
      h={'90vh'}
    >
      <ModalCloseButton onClick={onClose} />
      <Flex mt={2} flexDirection={'column'} flex={'1 0 0'}>
        <Box pb={[5, 7]} px={[4, 8]} borderBottom={theme.borders.base} style={{ display: 'none' }}>
          <MyRadio
            gridTemplateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
            list={[
              {
                icon: 'indexImport',
                title: t('core.dataset.import.Chunk Split'),
                desc: t('core.dataset.import.Chunk Split Tip'),
                value: ImportTypeEnum.chunk
              }
            ]}
            value={importType}
            onChange={(e) => setImportType(e as `${ImportTypeEnum}`)}
          />
        </Box>

        <Provider
          {...typeMap}
          vectorModel={vectorModel.model}
          agentModel={agentModel.model}
          datasetId={datasetDetail._id}
          importType={importType}
          parentId={parentId}
          onUploadSuccess={uploadSuccess}
        >
          <Box flex={'1 0 0'} h={0}>
            {importType === ImportTypeEnum.chunk && <ChunkImport />}
          </Box>
        </Provider>
      </Flex>
    </MyModal>
  );
};

export default ImportWebData;
