'use client';
import {
  Avatar,
  Box,
  Button,
  Center,
  Circle,
  Flex,
  FormControl,
  Grid,
  HStack,
  Heading,
  Input,
  Spacer,
  VStack,
  Text,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMessages } from '../hooks/useMessages';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <VStack
      w="100vw"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Image src="/assets/logo.png" alt="logo" width={200} height={200} />
      <VStack w="100%" justifyContent="center" alignItems="center" gap="20px">
        <Button
          backgroundColor="#E3A6B5"
          color="#fff"
          w="80%"
          onClick={() =>
            router.push(
              'https://www.figma.com/proto/Fm3lrMa5a9FeQzaHbvYS9D/HerFlourish?node-id=144-4&starting-point-node-id=99%3A97'
            )
          }
        >
          See Prototype
        </Button>
        <Button
          backgroundColor="#BEE1D7"
          color="#fff"
          w="80%"
          onClick={() => router.push('/ann')}
        >
          Chat with Ann
        </Button>
      </VStack>
    </VStack>
  );
}
