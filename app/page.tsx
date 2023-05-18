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
import { useState } from 'react';

const pre = [
  {
    user: 'bot',
    message:
      'Hi 👋, I am Ann, your financial friend powered by AI. I am here to help answer any questions you have about personal finance, investments, budgeting, or anything else related to your financial well-being. Feel free to ask me anything, and I will do my best to provide you with helpful and informative answers.',
  },
  {
    user: 'bot',
    message: 'How can I help you today? 🤗',
  },
];

export default function Home() {
  const [messages, setMessages] = useState(pre);
  const [newMessage, setNewMessage] = useState('');

  const handleNewMessage = (e: any) => {
    e.preventDefault();
    if (newMessage) {
      setMessages([...messages, { user: 'user', message: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <Grid
      width="100vw"
      height="100vh"
      gridTemplateRows="auto 50px 70px"
      background="linear-gradient(184deg, rgba(64,82,190,1) 0%, rgba(219,70,125,1) 84%)"
      position="relative"
    >
      <HStack
        position="absolute"
        top="0"
        w="100%"
        p="20px"
        alignItems="center"
        gap="10px"
        zIndex="1000"
      >
        <Avatar
          size="md"
          mt="auto"
          src="https://i.pinimg.com/550x/50/b2/6c/50b26ce6d2bc8adcf0e9a720c6fdc3f9.jpg"
          border="4px solid #41C3A7"
        />
        <VStack align="left" spacing="2px">
          <Heading size="sm" color="#fff">
            Your virtual assistant
          </Heading>
          <HStack>
            <Circle
              backgroundColor="#3EE923"
              size="2"
              border="2px solid white"
            />
            <Text color="rgba(217, 217, 217, 0.8);" fontSize="12px">
              online now & always
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <Box
        bgColor="rgba(217, 217, 217, 0.1);"
        paddingTop="100px"
        paddingX="10px"
        overflow="scroll"
        gap="15px"
        display="flex"
        flexDirection="column"
      >
        {messages.map((data: any) => {
          return (
            <Flex
              key={data.message}
              justifyContent={data.user === 'bot' ? 'flex-start' : 'flex-end'}
              w="100%"
              gap="10px"
            >
              {data.user === 'bot' && (
                <Avatar
                  size="xs"
                  mt="auto"
                  src="https://i.pinimg.com/550x/50/b2/6c/50b26ce6d2bc8adcf0e9a720c6fdc3f9.jpg"
                />
              )}
              <Box
                backgroundColor={data.user === 'bot' ? 'gray.100' : 'gray.400'}
                padding="12px"
                maxW="80%"
                borderRadius="20px"
              >
                {data.message}
              </Box>
              {data.user !== 'bot' && <Avatar size="xs" mt="auto" />}
            </Flex>
          );
        })}
      </Box>
      <HStack p="5px 15px" backgroundColor="#fff">
        <form onSubmit={(e) => handleNewMessage(e)} style={{ width: '100%' }}>
          <FormControl
            display="grid"
            gridTemplateColumns="auto 40px"
            gap="10px"
          >
            <Input
              placeholder="Ask a question"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" backgroundColor="gray.100">
              <Image src="/assets/send.png" alt="icon" width="50" height="50" />
            </Button>
          </FormControl>
        </form>
      </HStack>
      <HStack
        bgColor="#FFFFFF"
        px="25px"
        py="10px"
        borderTop="1px solid lightgray"
        align="center"
        justifyContent="space-between"
      >
        <Image src="/assets/icon1.png" alt="icon" width="30" height="30" />
        <Image src="/assets/icon2.png" alt="icon" width="30" height="30" />
        <Circle
          size="50px"
          backgroundColor="#DF3161"
          fontSize="24px"
          color="#fff"
        >
          ?
        </Circle>
        <Image src="/assets/icon3.png" alt="icon" width="30" height="30" />
        <Image src="/assets/icon4.png" alt="icon" width="30" height="30" />
      </HStack>
    </Grid>
  );
}
