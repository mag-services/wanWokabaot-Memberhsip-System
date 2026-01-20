<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'barcode' => $this->faker->unique()->ean13(),
            'sku' => $this->faker->unique()->swiftBicNumber(),
            'category' => $this->faker->word(),
            'selling_price' => $this->faker->randomFloat(2, 1, 100),
            'cost_price' => $this->faker->randomFloat(2, 0.5, 80),
            'current_stock' => $this->faker->numberBetween(0, 100),
            'min_stock' => $this->faker->numberBetween(5, 20),
            'unit' => 'piece',
            'description' => $this->faker->sentence(),
        ];
    }
}
