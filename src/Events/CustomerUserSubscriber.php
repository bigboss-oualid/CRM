<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    /**
     * @var Security
     */
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            kernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE],
        ];
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        /** @var Customer $customer */
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        //set user to cosutomer only by POST customer Requests
        if ($customer instanceof  Customer && $method  === 'POST') {
            /** @var User $user */
            $user = $this->security->getUser();
            $customer->setUser($user);
        }
    }
}
