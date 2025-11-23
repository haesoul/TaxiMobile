import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { IRootState } from '../../state'
import { configSelectors } from '../../state/config'
import Header from '../Header'

const mapStateToProps = (state: IRootState) => ({
  configStatus: configSelectors.status(state),
})

const connector = connect(mapStateToProps)

interface IProps extends ConnectedProps<typeof connector> {}

function Layout({ children, configStatus }: React.PropsWithChildren<IProps>) {
  return (
    <View style={styles.layout}>
      <Header key={configStatus} style={styles.header} />
      <ScrollView contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    zIndex: 1,
  },
  content: {
    flexGrow: 1,
    flexDirection: 'column',
    zIndex: 0,
  },
  loadingFrame: {
    flex: 1,
    marginTop: 73,
  },
})

export default connector(Layout)
