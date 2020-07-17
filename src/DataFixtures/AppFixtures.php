<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * Password Encoder.
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('de_DE');

        for ($u = 0; $u < 10; ++$u) {
            $user = new User();

            $invoiceNumber = 1;

            $hash = $this->encoder->encodePassword($user, 'demo');

            $user->setLastName($faker->lastName)
                ->setFirstName($faker->firstName)
                ->setEmail($faker->email)
                ->setPassword($hash);

            for ($c = 0; $c < mt_rand(5, 20); ++$c) {
                $customer = new Customer();
                $customer->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setCompany($faker->company)
                    ->setUser($user);

                $manager->persist($customer);

                for ($i = 0; $i < mt_rand(3, 10); ++$i) {
                    $invoice = new Invoice();
                    $invoice->setAmount($faker->randomFloat(2, 300, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($customer)
                        ->setInvoiceNumber($invoiceNumber++);

                    $manager->persist($invoice);
                }
            }

            $manager->persist($user);
        }

        $manager->flush();
    }
}
