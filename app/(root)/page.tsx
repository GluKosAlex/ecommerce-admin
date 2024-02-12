import Modal from '@/components/ui/modal';

export default function RootPage() {
  return (
    <main>
      <div className='p-4'>
        <Modal isOpen={true} description='test' title='test' onClose={() => {}}>
          Children
        </Modal>
      </div>
    </main>
  );
}
