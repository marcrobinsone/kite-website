package main

import (
	"flag"
	"github.com/koding/kite"
	"io/ioutil"
	"log"
	"strings"

	"github.com/koding/kite/config"
	"github.com/koding/kite/kontrol"
)

func main() {
	var (
		publicKeyFile  = flag.String("public-key", "", "")
		privateKeyFile = flag.String("private-key", "", "")
		ip             = flag.String("ip", "0.0.0.0", "")
		port           = flag.Int("port", 4000, "")
		etcdAddr       = flag.String("etcd-addr", "http://127.0.0.1:4001", "The public host:port used for etcd server.")
		etcdBindAddr   = flag.String("etcd-bind-addr", ":4001", "The listening host:port used for etcd server.")
		peerAddr       = flag.String("peer-addr", "http://127.0.0.1:7001", "The public host:port used for peer communication.")
		peerBindAddr   = flag.String("peer-bind-addr", ":7001", "The listening host:port used for peer communication.")
		name           = flag.String("name", "", "name of the instance")
		dataDir        = flag.String("data-dir", "", "directory to store data")
		peers          = flag.String("peers", "", "comma seperated peer addresses")
	)

	flag.Parse()

	if *publicKeyFile == "" {
		log.Fatalln("no -public-key given")
	}

	if *privateKeyFile == "" {
		log.Fatalln("no -private-key given")
	}

	publicKey, err := ioutil.ReadFile(*publicKeyFile)
	if err != nil {
		log.Fatalln("cannot read public key file")
	}

	privateKey, err := ioutil.ReadFile(*privateKeyFile)
	if err != nil {
		log.Fatalln("cannot read private key file")
	}

	conf := config.MustGet()
	conf.IP = *ip
	conf.Port = *port

	k := kontrol.New(conf, string(publicKey), string(privateKey))
	k.EtcdAddr = *etcdAddr
	k.EtcdBindAddr = *etcdBindAddr
	k.PeerAddr = *peerAddr
	k.PeerBindAddr = *peerBindAddr

	if *name != "" {
		k.Name = *name
	}
	if *dataDir != "" {
		k.DataDir = *dataDir
	}
	if *peers != "" {
		k.Peers = strings.Split(*peers, ",")
	}

	// We don't need to check password or token in demo.
	// Just use the key as username.
	k.AddAuthenticator("username", func(r *kite.Request) error {
		r.Username = r.Authentication.Key
		return nil
	})

	k.Run()
}
