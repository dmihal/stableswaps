import React from 'react'
import { NextPage, GetStaticProps } from 'next'
import sdk from 'data/sdk'
import List from 'components/List'
import SocialTags from 'components/SocialTags'

interface HomeProps {
  data: any[]
}

export const Home: NextPage<HomeProps> = ({ data }) => {
  const _data: any[] = []
  const dataByProtocol: any = {}
  for (const item of data[data.length - 1].values) {
    if (!dataByProtocol[item.protocol]) {
      dataByProtocol[item.protocol] = { name: item.protocol, total: 0 }
      _data.push(dataByProtocol[item.protocol])
    }
    dataByProtocol[item.protocol].total += item.value
  }

  return (
    <main>
      <SocialTags />

      <h1 className="title">StableSwaps.info</h1>

      <p className="description">
        Which DEX is swapping the most assets?
      </p>

      <div>
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          className="twitter-share-button"
          data-show-count="true"
        >
          Tweet
        </a>
        <script async src="https://platform.twitter.com/widgets.js"></script>
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      <List data={_data} />

      <style jsx>{`
        main {
          padding: 2rem 0 3rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .title {
          margin: 0 0 16px;
          line-height: 1.15;
          font-size: 4rem;
          font-weight: 700;
        }

        .title,
        .description {
          text-align: center;
          max-width: 800px;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
          margin: 4px 0 20px;
        }
      `}</style>
    </main>
  );
};

/*
 * Looking for the data source?
 *
 * This site pulls data from the CryptoStats protocol
 * Visit https://cryptostats.community/discover/issuance to see the code for these adapters
 */
export const getStaticProps: GetStaticProps = async () => {
  const list = sdk.getCollection('stable-swaps')
  await list.fetchAdapterFromIPFS('QmPsskcHLPjFQqN55yvGyPAKBwWkb1VBoRPbucoht52LcW')
  const adapters = list.getAdapters()

  const today = sdk.date.formatDate(new Date)
  const startDate = sdk.date.offsetDaysFormatted(today, -5)

  let data = []
  const assets = ['usd', 'eur', 'btc', 'eth']

  for (let date = startDate; sdk.date.isBefore(date, today); date = sdk.date.offsetDaysFormatted(date, 1)) {
    const values = await Promise.all(adapters.map(adapter =>
      Promise.all(assets.map(async asset => ({
          protocol: adapter.id,
          asset,
          date,
          value: await adapter.executeQuery('oneDayTotalVolumeUSDByAsset', asset, date)
        })
      ))))
    
    const valuesFlat = values.reduce((flat, current) => [...flat, ...current], [])

    if (date === '2022-03-01') {
      break
    }

    data.push({ date, values: valuesFlat })
  }

  return { props: { data }, revalidate: 60 };
};

export default Home;
