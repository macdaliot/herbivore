import EventEmitter from 'events'
import network from 'network'
import oui from 'oui'
// import  ping = 'ping'
// const network = require('network')
// const arp = require('arp-a')

class HostInfo extends EventEmitter {

  get self () {
    return this.self
  }

  getVendorInfo (mac) {
    const vendorInfo = oui(mac)
    if (vendorInfo != null && vendorInfo.indexOf('\n') > -1) {
      return vendorInfo.split('\n')[0]
    } else {
      return ''
    }
  }
  get network () {
    return this.network
  }

  // constructor () {
  //   super()
  //   // this.init()
  // }

  init () {
    network.get_active_interface((err, obj) => {
      if (err) {
        this.emit('error', 'interface')
        return
      }

      if (!obj) {
        this.emit('error', 'interface')
        return
      }
      // {ip_address, gateway_ip, name, netmask, mac_address } = obj
      obj.vendor = this.getVendorInfo(obj.mac_address)
      this.emit('host_info_available', obj)
      this.getPublicIP()
    })
  }

  getPublicIP () {
    network.get_public_ip((err, ip) => {
      if (err) this.emit('error', err.message)
      if (!ip) this.emit('error')
      // console.log('ERE')
      this.emit('setPublicIp', ip)
    })
  }
}

export default new HostInfo()
