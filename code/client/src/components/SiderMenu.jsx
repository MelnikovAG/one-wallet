import React from 'react'
import { useHistory, useRouteMatch } from 'react-router'
import Layout from 'antd/es/layout'
import Image from 'antd/es/image'
import Row from 'antd/es/row'
import Menu from 'antd/es/menu'
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined'
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined'
import HistoryOutlined from '@ant-design/icons/HistoryOutlined'
import AuditOutlined from '@ant-design/icons/AuditOutlined'
import GithubOutlined from '@ant-design/icons/GithubOutlined'
import InfoCircleOutlined from '@ant-design/icons/InfoCircleOutlined'
import ToolOutlined from '@ant-design/icons/ToolOutlined'
import HarmonyLogo from '../assets/harmony.svg'
// import ModuloLogoLong from '../assets/logo-300-text-white.png'
import ModuloLogo from '../assets/logo-300-text-short-white.png'
import OverviewIcon from '../assets/icons/overview.svg?el'
import AssetsIcon from '../assets/icons/assets.svg?el'
import NFTIcon from '../assets/icons/nft.svg?el'
import SwapIcon from '../assets/icons/swap.svg?el'
import StakeIcon from '../assets/icons/stake.svg?el'
import RestoreIcon from '../assets/icons/restore.svg?el'
import config from '../config'
import Paths from '../constants/paths'
import util, { useWindowDimensions } from '../util'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, getColorPalette } from '../theme'
import { StatsInfo, LineDivider } from './StatsInfo'
import { globalActions } from '../state/modules/global'
import { SiderLink } from './Text'
import { CloudOutlined, ContactsOutlined, WalletOutlined } from '@ant-design/icons'

const mobileMenuItemStyle = {
  padding: '0 10px',
  fontSize: 12
}

const Logos = {
  harmony: HarmonyLogo,
  modulo: ModuloLogo,
}
const Logo = Logos[config.logoId] ?? ModuloLogo

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
      <Menu.Item key='backup' style={mobileMenuItemStyle} icon={<CloudOutlined />}>Backup</Menu.Item>
      <Menu.Item key='contacts' style={mobileMenuItemStyle} icon={<ContactsOutlined />}>Contacts</Menu.Item>
      <Menu.Item key='about' style={mobileMenuItemStyle} icon={<WalletOutlined />}><SiderLink style={{ color: null }} href='https://modulo.so'>Modulo</SiderLink></Menu.Item>
      <Menu.Item key='bug' style={mobileMenuItemStyle} icon={<GithubOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/issues'>Bug Report</SiderLink></Menu.Item>
      <Menu.Item key='audit' style={mobileMenuItemStyle} icon={<AuditOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/tree/master/audits'>Audits</SiderLink></Menu.Item>
      <Menu.Item key='wiki' style={mobileMenuItemStyle} icon={<InfoCircleOutlined />}><SiderLink style={{ color: null }} href='https://github.com/polymorpher/one-wallet/wiki'>Wiki</SiderLink></Menu.Item>
      <Menu.Item key='tools' style={mobileMenuItemStyle} icon={<ToolOutlined />}>Tools</Menu.Item>
    </Menu>
  )
}

const DeskstopSiderMenu = ({ action, nav, ...args }) => {
  return (
    <Layout.Sider collapsed={false} {...args} theme='dark'>
      {/* <Image src='/assets/harmony.svg' /> */}
      <Row justify='center'>
        <SiderLink href={config.logoLink}>
          <Image preview={false} src={Logo} style={{ cursor: 'pointer', padding: 32 }} />
        </SiderLink>
      </Row>

      <Row justify='center' style={{ marginBottom: 24 }}><SiderLink style={{ color: 'white' }} href={config.appLink}>{config.appName} {config.version}</SiderLink></Row>

      <StatsInfo />

      <Menu theme='dark' mode='inline' onClick={nav} selectedKeys={[action]}>
        <Menu.Item key='create' icon={<PlusCircleOutlined />}>Create</Menu.Item>
        <Menu.Item key='wallets' icon={<UnorderedListOutlined />}>Wallets</Menu.Item>
        <Menu.Item key='restore' icon={<HistoryOutlined />}>Restore</Menu.Item>
        <Menu.Item key='backup' icon={<CloudOutlined />}>Backup</Menu.Item>
        <Menu.Item key='contacts' icon={<ContactsOutlined />}>Contacts</Menu.Item>
      </Menu>
      <LineDivider />
      <Menu theme='dark' mode='inline' selectable={false}>
        <Menu.Item key='pro' icon={<WalletOutlined />}><SiderLink style={{ color: null }} href='https://modulo.so'>About Modulo</SiderLink></Menu.Item>
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

const RouteActionMap = {
  show: 'wallet',
  nft: 'wallet/nft',
  assets: 'wallet/assets',
  swap: 'wallet/swap',
  stake: 'wallet/stake',
  restore: 'internal/restore',
  tool: 'internal/tool',
}

const DeskstopSiderMenuV2 = ({ nav, ...args }) => {
  const theme = useTheme()
  const match = useRouteMatch(Paths.matchStructure)
  const { category, section } = match ? match.params : {}

  const action = RouteActionMap[section] ?? RouteActionMap[category]

  const { primaryTextColor, secondaryTextColor } = getColorPalette(theme)

  return (
    <Layout.Sider collapsed={false} {...args} theme={theme} style={{ color: primaryTextColor }}>
      <Row justify='center'>
        <SiderLink href={config.logoLink}>
          <Image preview={false} src={Logo} style={{ cursor: 'pointer', padding: 32 }} />
        </SiderLink>
      </Row>

      <Row justify='center' style={{ marginBottom: 24 }}><SiderLink href={config.appLink}>{config.appName} {config.version}</SiderLink></Row>

      <Menu theme={theme} mode='inline' onClick={nav} selectedKeys={[action]}>
        {[
          { key: RouteActionMap.show, IconEl: OverviewIcon, label: 'Overview' },
          { key: RouteActionMap.assets, IconEl: AssetsIcon, label: 'Assets' },
          { key: RouteActionMap.nft, IconEl: NFTIcon, label: 'NFTs' },
          { key: RouteActionMap.swap, IconEl: SwapIcon, label: 'Swap' },
          { key: RouteActionMap.stake, IconEl: StakeIcon, label: 'Stake' },
          { key: RouteActionMap.restore, IconEl: RestoreIcon, label: 'Restore' },
        ].map(({ key, IconEl, label }) => <Menu.Item key={key} icon={<IconEl fill={action === 'overview' ? 'currentColor' : secondaryTextColor} />}>{label}</Menu.Item>)}
      </Menu>
      <LineDivider />
      <Menu theme={theme} mode='inline' className='secondary-menu' onClick={nav} selectedKeys={[action]} style={{ color: secondaryTextColor, textTransform: 'uppercase' }}>
        <Menu.Item key='external/pro'><SiderLink href='https://modulo.so'>About Modulo</SiderLink></Menu.Item>
        <Menu.Item key='external/audit'><SiderLink href='https://github.com/polymorpher/one-wallet/tree/master/audits'>Audits</SiderLink></Menu.Item>
        <Menu.Item key='external/wiki'><SiderLink href='https://github.com/polymorpher/one-wallet/wiki'>Wiki</SiderLink></Menu.Item>
        <Menu.Item key='external/bug'><SiderLink href='https://github.com/polymorpher/one-wallet/issues'>Bugs</SiderLink></Menu.Item>
        <Menu.Item key='external/network'><SiderLink href='https://github.com/polymorpher/one-wallet/issues'>Network</SiderLink></Menu.Item>
        <Menu.Item key='internal/tools'>Tools</Menu.Item>
      </Menu>
    </Layout.Sider>
  )
}

const MobileSiderMenuV2 = ({ nav, ...args }) => {
  const theme = useTheme()
  const { secondaryTextColor } = getColorPalette(theme)
  const match = useRouteMatch(Paths.matchStructure)
  const { category, section } = match ? match.params : {}
  const action = RouteActionMap[section] ?? RouteActionMap[category]

  return (
    <Menu
      theme={theme}
      mode='horizontal'
      onClick={nav}
      selectedKeys={[action]}
    >
      {[
        { key: RouteActionMap.show, IconEl: OverviewIcon, label: 'Overview' },
        { key: RouteActionMap.assets, IconEl: AssetsIcon, label: 'Assets' },
        { key: RouteActionMap.nft, IconEl: NFTIcon, label: 'NFTs' },
        { key: RouteActionMap.swap, IconEl: SwapIcon, label: 'Swap' },
        { key: RouteActionMap.stake, IconEl: StakeIcon, label: 'Stake' },
        { key: RouteActionMap.restore, IconEl: RestoreIcon, label: 'Restore' },
      ].map(({ key, IconEl, label }) => <Menu.Item key={key} style={{ display: 'flex', alignItems: 'center' }} icon={<IconEl fill={action === 'overview' ? 'currentColor' : secondaryTextColor} />}>{label}</Menu.Item>)}
      <Menu.Item key='external/grant'><SiderLink href='https://harmony.one/wallet'>Grants</SiderLink></Menu.Item>
      <Menu.Item key='external/audit'><SiderLink href='https://github.com/polymorpher/one-wallet/tree/master/audits'>Audits</SiderLink></Menu.Item>
      <Menu.Item key='external/wiki'><SiderLink href='https://github.com/polymorpher/one-wallet/wiki'>Wiki</SiderLink></Menu.Item>
      <Menu.Item key='external/bug'><SiderLink href='https://github.com/polymorpher/one-wallet/issues'>Bugs</SiderLink></Menu.Item>
      <Menu.Item key='external/network'><SiderLink href='https://github.com/polymorpher/one-wallet/issues'>Network</SiderLink></Menu.Item>
      <Menu.Item key='internal/tools'>Tools</Menu.Item>
    </Menu>
  )
}

export const SiderMenuV2 = ({ ...args }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { isMobile } = useWindowDimensions()
  const wallets = useSelector(state => state.wallet)
  const selectedAddress = useSelector(state => state.global.selectedWallet)
  const network = useSelector(state => state.global.network)
  const networkWallets = util.filterNetworkWallets(wallets, network)
  const matchedWallet = networkWallets.filter(w => w.address === selectedAddress)[0]

  args.nav = ({ key }) => {
    if (key.startsWith('wallet')) {
      // If no matched wallet, default to select the first if exists.
      if (!matchedWallet && networkWallets[0]) {
        dispatch(globalActions.selectWallet(networkWallets[0].address))
      }
      const matchedOrFirstWallet = matchedWallet ?? networkWallets[0]

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
    ? <MobileSiderMenuV2 {...args} />
    : <DeskstopSiderMenuV2 {...args} />
}

export default SiderMenu
