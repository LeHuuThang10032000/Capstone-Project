<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('store_id');
            $table->unsignedBigInteger('promocode_id')->nullable();
            $table->bigInteger('order_total');
            $table->bigInteger('discount_amount');
            $table->string('status');
            $table->string('note')->nullable();
            $table->text('product_detail');
            $table->timestamp('created_at', 0)->nullable();
            $table->timestamp('accepted_at', 0)->nullable();
            $table->timestamp('canceled_at', 0)->nullable();
            $table->timestamp('processing_at', 0)->nullable();
            $table->timestamp('finished_at', 0)->nullable();
            $table->timestamp('updated_at', 0)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
