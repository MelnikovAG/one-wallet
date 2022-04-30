import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import Layout from 'antd/es/layout'
import Image from 'antd/es/image'
import Row from 'antd/es/row'
import Menu from 'antd/es/menu'
import Typography from 'antd/es/typography'
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined'
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined'
import HistoryOutlined from '@ant-design/icons/HistoryOutlined'
import AuditOutlined from '@ant-design/icons/AuditOutlined'
import GithubOutlined from '@ant-design/icons/GithubOutlined'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import DollarOutlined from '@ant-design/icons/DollarOutlined'
import ToolOutlined from '@ant-design/icons/ToolOutlined'
import HarmonyLogo from '../assets/harmony.svg'
import OneWalletLogo from '../assets/1walletlogo.svg'
import OverviewIcon from '../assets/icons/overview.svg?el'
import AssetsIcon from '../assets/icons/assets.svg?el'
import NFTIcon from '../assets/icons/nft.svg?el'
import SwapIcon from '../assets/icons/swap.svg?el'
import StakeIcon from '../assets/icons/stake.svg?el'
import RestoreIcon from '../assets/icons/restore.svg?el'
import config from '../config'
import Paths from '../constants/paths'
import styled from 'styled-components'
import util, { useWindowDimensions } from '../util'
import { useSelector } from 'react-redux'
import { useTheme, getColorPalette } from '../theme'
import { StatsInfo, LineDivider } from './StatsInfo'
const { Link } = Typography

const SiderLink = styled(Link).attrs((e) => ({
  ...e,
  style: { ...e.style },
  target: '_blank',
  rel: 'noopener noreferrer'
}))`
  &:hover {
    opacity: 0.8;
  }
`

const mobileMenuItemStyle = {
  padding: '0 10px',
  fontSize: 12
}

const MobileSiderMenu = ({ action, nav, ...args }) => {
  const theme = useTheme()
  return (
    <Menu
      theme={theme}
      mode='horizontal'
      onClick={nav}
      selectedKeys={[action]}
    >
      <Menu.Item key='create' style={mobileMenuItemStyle} icon={<PlusCircleOutlined />}>Create</Menu.Item>
      <Menu.Item key='wallets' style={mobileMenuItemStyle} icon={<UnorderedListOutlined />}>Wallets</Menu.Item>
      <Menu.Item key='restore' style={mobileMenuItemStyle} icon={<HistoryOutlined />}>Restore</Menu.Item>
      <Menu.Item key='grant' style={mobileMenuItemStyle} icon={<DollarOutlined />}><SiderLink style={{ color: null }} href='https://harmony.one/wallet'>Grants</SiderLink></Menu.Item>
      <Menu.Item key='bug' style={mobileMenuItemStyle} icon={<GithubOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/issues'>Bug Report</SiderLink></Menu.Item>
      <Menu.Item key='audit' style={mobileMenuItemStyle} icon={<AuditOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/tree/master/audits'>Audits</SiderLink></Menu.Item>
      <Menu.Item key='wiki' style={mobileMenuItemStyle} icon={<InfoCircleOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/wiki'>Wiki</SiderLink></Menu.Item>
      <Menu.Item key='tools' style={mobileMenuItemStyle} icon={<ToolOutlined />}>Tools</Menu.Item>
    </Menu>
  )
}

const DeskstopSiderMenu = ({ action, nav, ...args }) => {
  const history = useHistory()

  return (
    <Layout.Sider collapsed={false} {...args} theme='dark'>
      {/* <Image src='/assets/harmony.svg' /> */}
      <Row justify='center'>
        <SiderLink href='https://harmony.one/'>
          <Image preview={false} src={HarmonyLogo} style={{ cursor: 'pointer', padding: 32 }} onClick={() => history.push('/')} />
        </SiderLink>
      </Row>

      <Row justify='center' style={{ marginBottom: 24 }}><SiderLink style={{ color: 'white' }} href='https://github.com/polymorpher/one-wallet'>{config.appName} {config.version}</SiderLink></Row>

      <StatsInfo />

      <Menu theme='dark' mode='inline' onClick={nav} selectedKeys={[action]}>
        <Menu.Item key='create' icon={<PlusCircleOutlined />}>Create</Menu.Item>
        <Menu.Item key='wallets' icon={<UnorderedListOutlined />}>Wallets</Menu.Item>
        <Menu.Item key='restore' icon={<HistoryOutlined />}>Restore</Menu.Item>
      </Menu>
      <LineDivider />
      <Menu theme='dark' mode='inline' selectable={false}>
        <Menu.Item key='grant' icon={<DollarOutlined />}><SiderLink style={{ color: null }} href='https://modulo.so'>Pro Version</SiderLink></Menu.Item>
        <Menu.Item key='bug' icon={<GithubOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/issues'>Bug Report</SiderLink></Menu.Item>
        <Menu.Item key='audit' icon={<AuditOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/tree/master/audits'>Audits</SiderLink></Menu.Item>
        <Menu.Item key='wiki' icon={<InfoCircleOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/wiki'>Wiki</SiderLink></Menu.Item>
      </Menu>
      <LineDivider />
      <Menu theme='dark' mode='inline' onClick={nav} selectedKeys={[action]}>
        <Menu.Item key='tools' icon={<ToolOutlined />}>Tools</Menu.Item>
      </Menu>
    </Layout.Sider>
  )
}

const DeskstopSiderMenuV2 = ({ action, nav, ...args }) => {
  const history = useHistory()
  const theme = useTheme()

  const { primaryTextColor, secondaryTextColor } = getColorPalette(theme)

  return (
    <Layout.Sider collapsed={false} {...args} theme={theme} style={{ color: primaryTextColor }}>
      <Row justify='center'>
        <SiderLink href='https://harmony.one/'>
          <Image preview={false} src={OneWalletLogo} style={{ cursor: 'pointer', padding: 32 }} onClick={() => history.push('/')} />
        </SiderLink>
      </Row>

      <Row justify='center' style={{ marginBottom: 24 }}><SiderLink href='https://harmony.one/1wallet'>{config.appName} {config.version}</SiderLink></Row>

      <Menu theme={theme} mode='inline' onClick={nav} selectedKeys={[action]}>
        <Menu.Item key='wallet' icon={<OverviewIcon fill={action === 'overview' ? 'currentColor' : secondaryTextColor} />}>Overview</Menu.Item>
        <Menu.Item key='wallet/assets' icon={<AssetsIcon fill={action === 'assets' ? 'currentColor' : secondaryTextColor} />}>Assets</Menu.Item>
        <Menu.Item key='wallet/nft' icon={<NFTIcon fill={action === 'nft' ? 'currentColor' : secondaryTextColor} />}>NFTs</Menu.Item>
        <Menu.Item key='wallet/swap' icon={<SwapIcon fill={action === 'swap' ? 'currentColor' : secondaryTextColor} />}>Swap</Menu.Item>
        <Menu.Item key='wallet/stake' icon={<StakeIcon fill={action === 'stake' ? 'currentColor' : secondaryTextColor} />}>Stake</Menu.Item>
        <Menu.Item key='internal/restore' icon={<RestoreIcon fill={action === 'restore' ? 'currentColor' : secondaryTextColor} />}>Restore</Menu.Item>
      </Menu>
      <LineDivider />
      <Menu theme={theme} mode='inline' className='secondary-menu' onClick={nav} selectedKeys={[action]} style={{ color: secondaryTextColor, textTransform: 'uppercase' }}>
        <Menu.Item key='external/grant'><SiderLink href='https://harmony.one/wallet'>Grants</SiderLink></Menu.Item>
        <Menu.Item key='external/audit'><SiderLink href='https://github.com/polymorpher/one-wallet/tree/master/audits'>Audits</SiderLink></Menu.Item>
        <Menu.Item key='external/wiki'><SiderLink href='https://github.com/polymorpher/one-wallet/wiki'>Wiki</SiderLink></Menu.Item>
        <Menu.Item key='external/bug'><SiderLink href='https://github.com/polymorpher/one-wallet/issues'>Bugs</SiderLink></Menu.Item>
        <Menu.Item key='external/network'><SiderLink href='https://github.com/polymorpher/one-wallet/issues'>Network</SiderLink></Menu.Item>
        <Menu.Item key='internal/tools'>Tools</Menu.Item>
      </Menu>
    </Layout.Sider>
  )
}

const SiderMenu = ({ ...args }) => {
  const { isMobile } = useWindowDimensions()
  const history = useHistory()
  const match = useRouteMatch('/:action')
  const { action } = match ? match.params : {}
  args.action = action
  args.nav = ({ key }) => {
    history.push(Paths[key])
  }

  return isMobile
    ? <MobileSiderMenu {...args} />
    : <DeskstopSiderMenu {...args} />
}

export const SiderMenuV2 = ({ ...args }) => {
  const history = useHistory()
  const { isMobile } = useWindowDimensions()
  const wallets = useSelector(state => state.wallet)
  const selectedAddress = useSelector(state => state.global.selectedWallet)
  const network = useSelector(state => state.global.network)
  const networkWallets = util.filterNetworkWallets(wallets, network)
  const matchedOrFirstWallet = networkWallets.filter(w => w.address === selectedAddress)[0] ?? networkWallets[0]

  args.nav = ({ key }) => {
    if (key.startsWith('wallet')) {
      if (matchedOrFirstWallet) {
        const [, action] = key.split('/')
        history.push(Paths.showAddress(matchedOrFirstWallet.address, action))
      } else {
        history.push(Paths.create)
      }
    } else if (key.startsWith('internal')) {
      const [, action] = key.split('/')
      history.push(Paths[action])
    }
  }

  return isMobile
    ? <MobileSiderMenu {...args} />
    : <DeskstopSiderMenuV2 {...args} />
}

export default SiderMenu
