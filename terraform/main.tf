resource "vultr_instance" "instance" {
  plan              = "vc2-1c-1gb"
  region            = "sgp"
  snapshot_id       = "ec28c30c-55f3-4d2f-8719-7e42cf27bf42"
  firewall_group_id = "dd776525-5e19-42e1-b55a-ad6da1cf6a4b"
  hostname          = "vultr.guest"
  label             = "test-label"
  tags              = ["test-tag"]
  ssh_key_ids       = [var.ssh_key_id]
}
