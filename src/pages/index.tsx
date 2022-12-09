import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import React from 'react'
import { CheckboxSample } from '../components/Checkbox'
// const CheckboxSampleDynamic = dynamic(() => import('../components/Checkbox')
// .then(({ CheckboxSample }) => CheckboxSample))
export default function Home() {
  return (
    <Box>
      <Head>
        <title></title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CheckboxSample />
    </Box>
  )
}
