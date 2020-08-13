<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use App\Entity\User;
use App\Repository\InvoiceRepository;
use DateTime;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class InvoiceHandlerSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private $security;
    /**
     * @var InvoiceRepository
     */
    private $invoiceRepository;

    public function __construct(Security $security, InvoiceRepository $invoiceRepository)
    {
        $this->security = $security;
        $this->invoiceRepository = $invoiceRepository;
    }

    public static function getSubscribedEvents()
    {
        return [
            kernelEvents::VIEW => ['handleInvoice', EventPriorities::PRE_VALIDATE],
        ];
    }

    /**
     * set next invoiceNumber & date to send invoice.
     *
     * @param ViewEvent $event
     *
     * @return void
     */
    public function handleInvoice(ViewEvent $event): void
    {
        /** @var Invoice $invoice */
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        //set Invoice number to Invoice only by POST invoice Requests
        if ($invoice instanceof  Invoice && $method  === 'POST') {
            /** @var User $user */
            $user = $this->security->getUser();
            $nextInvoiceNumber = $this->invoiceRepository->findNextInvoiceNumber($user);
            /* @var User $user */
            $invoice->setInvoiceNumber($nextInvoiceNumber);
            if (empty($invoice->getSentAt())) {
                $invoice->setSentAt(new DateTime());
            }
        }
    }
}
