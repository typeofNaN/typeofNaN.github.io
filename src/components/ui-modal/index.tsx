'use client'

import { Modal } from '@heroui/react'
import { X } from 'lucide-react'

interface UiModalProps {
  open: boolean
  title: React.ReactNode
  children: React.ReactNode
  onClose: () => void
  size?: 'md' | 'lg' | 'cover' | 'full'
}

const UiModal = ({ open, title, children, onClose, size = 'lg' }: UiModalProps) => (
  <Modal>
    <Modal.Backdrop
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <Modal.Container
        size={size}
        placement="center"
        scroll="inside"
        className="modal-center-layout"
      >
        <Modal.Dialog>
          <Modal.CloseTrigger aria-label="关闭">
            <X size={20} aria-hidden="true" />
          </Modal.CloseTrigger>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  </Modal>
)

export default UiModal
