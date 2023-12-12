import React, { useState, useCallback } from 'react';
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  TableContainer,
  Flex,
  Box
} from '@chakra-ui/react';
import { getPayOrders, checkPayResult } from '@/web/support/wallet/pay/api';
import { listTransactions } from '@/web/support/pay/api';
import { formatAmountForDisplay } from '@/utils/stripe-helpers';
import { Products } from '@/constants/products';

import type { PayModelSchema } from '@fastgpt/global/support/wallet/pay/type';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '@fastgpt/global/support/wallet/bill/tools';
import { useToast } from '@/web/common/hooks/useToast';
import { useLoading } from '@/web/common/hooks/useLoading';
import MyIcon from '@/components/Icon';

const PayRecordTable = () => {
  const { Loading, setIsLoading } = useLoading();
  const [payOrders, setPayOrders] = useState<PayModelSchema[]>([]);
  const { toast } = useToast();

  const { data, isInitialLoading, isError, refetch } = useQuery(
    ['listTransactions'],
    listTransactions,
    {
      onSuccess: (res) => {
        setPayOrders(res);
      },
      onSettled: () => {
        // This function will be called whether the fetch is successful or encounters an error
        setIsLoading(false);
      }
    }
  );

  const handleRefreshPayOrder = useCallback(
    async (payId: string) => {
      setIsLoading(true);

      try {
        const data = await checkPayResult(payId);
        toast({
          title: data,
          status: 'success'
        });
      } catch (error: any) {
        toast({
          title: error?.message,
          status: 'warning'
        });
        console.log(error);
      }
      try {
        refetch();
      } catch (error) {}

      setIsLoading(false);
    },
    [refetch, setIsLoading, toast]
  );
  var sl = 0;

  return (
    <Box position={'relative'} h={'100%'} overflow={'overlay'}>
      {!isInitialLoading && payOrders.length === 0 ? (
        <Flex h={'100%'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
          <MyIcon name="empty" w={'48px'} h={'48px'} color={'transparent'} />
          <Box mt={2} color={'myGray.500'}>
            No Transactions yet
          </Box>
        </Flex>
      ) : (
        <TableContainer py={[0, 5]} px={[3, 8]}>
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Time</Th>
                <Th>Price</Th>
                <Th>Product</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody fontSize={'sm'}>
              {payOrders.map((item) => {
                sl++;
                var color;
                if (item.status == 'SUCCESS') color = 'var(--chakra-colors-green-200)';
                else if (item.status == 'INITIATED') color = 'var(--chakra-colors-blue-200)';
                else if (item.status == 'REFUND') color = 'var(--chakra-colors-orange-200)';
                else if (item.status == 'FAILED') color = 'var(--chakra-colors-red-200)';
                else if (item.status == 'CLOSED') color = 'var(--chakra-colors-red-200)';
                else color = 'var(--chakra-colors-blue-200)';
                // const txnID = item._id.replace(/(.{4})/g, "$1-").slice(0, -1);;
                const prod = Products.find((prod_) => prod_.id === Number(item.product));
                var product = '';
                if (prod?.tokens !== undefined && prod.tokens != 0) {
                  product += `Tokens: ${prod.tokens}`;
                }

                return (
                  <Tr key={item._id}>
                    <Td>{sl}</Td>
                    <Td>
                      {item.createTime ? dayjs(item.createTime).format('D MMM YYYY hh:mm A') : '-'}
                    </Td>
                    <Td>{formatAmountForDisplay(item.price, 'usd')}</Td>
                    <Td>
                      <Text>{product}</Text>
                    </Td>
                    <Td style={{ textAlign: 'center' }}>
                      <Text
                        style={{
                          background: color,
                          width: 'fit-content',
                          paddingLeft: 4,
                          paddingRight: 4,
                          borderRadius: 4,
                          fontWeight: 'bold'
                        }}
                      >
                        {item.status}
                      </Text>
                    </Td>
                    {/* <Td>
                    {item.status === 'NOTPAY' && (
                      <Button onClick={() => handleRefreshPayOrder(item._id)} size={'sm'}>
                        更新
                      </Button>
                    )}
                  </Td> */}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <Loading loading={isInitialLoading} fixed={false} />
    </Box>
  );
};

export default PayRecordTable;
